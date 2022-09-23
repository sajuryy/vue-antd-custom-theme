import type {Signer} from "@ethersproject/abstract-signer"
import {BigNumber, Contract, ContractFactory,} from "ethers"
import type {ITokensClient} from "../../ITokensClient"
import type {ITransactionSignerProvider} from "../../ITransactionSignerProvider"
import type {IContractDataProvider} from "../../IContractDataProvider"
import type {IEthToken, ITokenInfo} from "../../../../models/EthToken"
import type {CreateEthTokenData} from "../../CreateEthTokenData"
import type {IDeployedContract} from "../../IDeployedContract"
import type {EthLikeContractData} from "../../EthLikeContractData"
import type {IOperationFlow} from "../../engine/IOperationFlow"
import type {IOperationStep} from "../../engine/IOperationStep"
import {TokenCreationInterstepState} from "../../engine/TokenCreationInterstepState"
import {GeneralOperationStep} from "../../engine/IOperationStep"
import {GeneralOperationsFlow} from "../../engine/IOperationFlow"
import type {ITokenDataReader} from "./ITokenDataReader"

export class ImversedTokensClient implements ITokensClient {
    public constructor(private readonly transactionSignerProvider: ITransactionSignerProvider,
                       private readonly dataReader: ITokenDataReader,
                       private readonly contractDataProvider: IContractDataProvider,
                       private readonly retryCount: number = 10) {
    }

    public async getTokenInfoByContractAddress(contractAddress: string): Promise<ITokenInfo | null> {
        return await this.dataReader.getTokenInfoByContractAddress(contractAddress)
    }

    public async getOwnBalanceInContract(getContractAddress: string): Promise<string> {
        const signer = await this.transactionSignerProvider.getSigner<Signer>()
        if (!signer || !signer.provider) {
            throw "Cannot get signer or signed has no provider configured"
        }
        const contractData = this.contractDataProvider.getNewTokenContractData<EthLikeContractData>()
        const contract = new Contract(getContractAddress, contractData!.contractInterface, signer)
        const balance = await contract.balanceOf(signer.getAddress())
        return balance.toString()
    }

    public async getListOfOwnTokens(): Promise<IEthToken[]> {
        const signer = await this.transactionSignerProvider.getSigner<Signer>()
        if (!signer || !signer.provider) {
            throw "Cannot get signer or signed has no provider configured"
        }
        const address = await signer.getAddress()
        return this.dataReader.getTokenListByAddress(address)
    }

    public async createNewToken(token: CreateEthTokenData): Promise<IOperationFlow<IDeployedContract | null>> {
        const contractData = this.contractDataProvider.getNewTokenContractData<EthLikeContractData>()
        if (!contractData) {
            throw "ETH like contract data expected"
        }

        const signer = await this.transactionSignerProvider.getSigner<Signer>()
        if (!signer || !signer.provider) {
            throw "Cannot get signer or signed has no provider configured"
        }

        const maxSupply = token.decimals + 12
        if (!token.supply.match(/^[1-9][0-9]+$/) && token.supply.length <= maxSupply) {
            throw `Cannot mint ${token.supply}, max amount is 999 999 999 999`
        }

        const steps: IOperationStep[] = []

        const interstepStorage = new TokenCreationInterstepState()

        steps.push(new GeneralOperationStep<TokenCreationInterstepState>(
            "imversed-create-token-eth-deploy-contract",
            async (storage: TokenCreationInterstepState) => {
                storage.deployedContract = await ImversedTokensClient.deployNewTokenContract(token, contractData, signer)
                return storage.deployedContract
            }, interstepStorage
        ))

        const signerProvider = signer.provider

        steps.push(new GeneralOperationStep<TokenCreationInterstepState>(
            "imversed-create-token-eth-wait-contract-deployment",
            async (storage: TokenCreationInterstepState) => {
                if(null == storage.deployedContract) {
                    throw "Contract was not deployed"
                }
                // wait contract processed
                for (let i = 0; i < this.retryCount; i++) {
                    const receipt = await signerProvider.getTransactionReceipt(storage.deployedContract.hash)
                    if (null != receipt) {
                        break
                    }

                    await new Promise(function (resolve, _) {
                        setTimeout(function () {
                            resolve(null)
                        }, 700)
                    })
                }
            },
            interstepStorage) as IOperationStep)

        steps.push(new GeneralOperationStep<TokenCreationInterstepState>(
          "imversed-create-token-eth-mint-tokens",
            async (storage: TokenCreationInterstepState) => {
                if(null == storage.deployedContract) {
                    throw "Contract was not deployed"
                }
                await ImversedTokensClient.sendTestToken(storage.deployedContract, contractData, signer)
                return storage.deployedContract
            }, interstepStorage))

        return new GeneralOperationsFlow<IDeployedContract | null>(steps, interstepStorage, () => {
            return interstepStorage.deployedContract
        })
    }

    private static async deployNewTokenContract(token: CreateEthTokenData, contractData: EthLikeContractData, signer: Signer): Promise<IDeployedContract> {
        const factory = new ContractFactory(contractData.contractInterface, contractData.bytecode, signer)
        const deployedContract = await factory.deploy(
            token.name,
            token.symbol,
            token.decimals,
            token.supply
        )

        return {
            address: deployedContract.address,
            hash: deployedContract.deployTransaction.hash
        }
    }

    private static async sendTestToken(deployedContract: IDeployedContract, contractData: EthLikeContractData, signer: Signer): Promise<void> {
        const signerAddress = signer.getAddress()
        const erc20_rw = new Contract(deployedContract.address, contractData.contractInterface, signer)
        const gas = await erc20_rw.estimateGas.transfer(signerAddress, 1)
        const resultGas = gas.add(BigNumber.from(Math.round(gas.toNumber() * 0.2)))
        const tx = await erc20_rw.transfer(signerAddress, 1, {gasLimit: resultGas})
        await tx.wait()
    }
}
