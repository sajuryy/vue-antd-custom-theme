import {bank, convertAddress, erc20, IWallet, loadWallet} from "@imversed/js-client"
import type {INetworksConfig} from "../../../INetworksConfig"
import type {IWalletStorage} from "../../../IWalletStorage"
import {ProviderType} from "../../../../models/ProviderType"
import type {V1Beta1Coin, V1Beta1Metadata} from "@imversed/js-client/lib/bank/rest"
import type {MsgConvertCoin, MsgConvertERC20} from "@imversed/js-client/lib/erc20/types/erc20/v1/tx"
import {Utils} from "../../../Utils"
import type {StdFee} from "@imversed/stargate"
import type {AccountData} from "@imversed/proto-signing/build/signer"
import type {Coin} from "@imversed/js-client/lib/erc20/types/cosmos/base/v1beta1/coin"
import type {V1TokenPair} from "@imversed/js-client/lib/erc20/rest"

export class ImversedBankClient {
  constructor(private readonly walletStore: IWalletStorage, private readonly networkConfig: INetworksConfig) {
  }

  public async getBalanceByToken(denom: string): Promise<V1Beta1Coin | null> {
    const {account} = await this.getWallet()
    const queryClient = await bank.queryClient({addr: this.networkConfig.cosmosQAddress})
    const {data} = await queryClient.queryBalance(account.address, {denom})
    return data.balance || null
  }

  public async moveAssetsFromCosmosToEth(amount: string, denom: string): Promise<any> {
    const {wallet, account} = await this.getWallet()

    const txClient = await erc20.txClient(wallet, {addr: this.networkConfig.cosmosTxAddress})
    const convertMessage = txClient.msgConvertCoin({
      coin: {denom, amount} as Coin,
      receiver: convertAddress(account.address),
      sender: account.address
    } as MsgConvertCoin)

    const fee = {
      amount: [{amount: Utils.imvToAimv(0.000001), denom: "aimv"}],
      gas: "1200000"
    } as StdFee
    return await txClient.signAndBroadcast([convertMessage], {fee})
  }

  public async moveAssetsFromEthToCosmos(amount: string, contractAddress: string): Promise<any> {
    const {wallet, account} = await this.getWallet()

    const txClient = await erc20.txClient(wallet, {addr: this.networkConfig.cosmosTxAddress})
    const convertMessage = txClient.msgConvertERC20({
      contract_address: contractAddress,
      amount: amount,
      receiver: account.address,
      sender: convertAddress(account.address)
    } as MsgConvertERC20)

    const fee = {
      amount: [{amount: Utils.imvToAimv(0.000001), denom: "aimv"}],
      gas: "1200000"
    } as StdFee
    return await txClient.signAndBroadcast([convertMessage], {fee})
  }

  public async getTokenPair(contractAddress: string): Promise<V1TokenPair | null> {
    const {account} = await this.getWallet()
    const queryClient = await erc20.queryClient({addr: this.networkConfig.cosmosQAddress})

    const {data} = await queryClient.queryTokenPair(contractAddress)
    return data.token_pair || null
  }

  public async getAllTokens(): Promise<V1Beta1Coin[]> {
    const {account} = await this.getWallet()

    const queryClient = await bank.queryClient({addr: this.networkConfig.cosmosQAddress})
    const allTokens: V1Beta1Coin[] = []

    let allTokensCollection
    do {
      allTokensCollection = await queryClient.queryAllBalances(account.address, {
        "pagination.key": allTokensCollection && allTokensCollection.data.pagination?.next_key ? allTokensCollection.data.pagination.next_key : undefined,
      })
      if (!allTokensCollection.data.pagination || !allTokensCollection.data.balances) throw "Error on retrieving result"
      allTokensCollection.data.balances.forEach(x => allTokens.push(x))
    } while (allTokensCollection.data.pagination.next_key)

    return allTokens
  }

  private async getWallet(): Promise<{ wallet: IWallet, account: AccountData }> {
    const state = this.walletStore.getWalletState()
    if (null === state || state.type !== ProviderType.MNEMONIC) {
      throw "Recovery phrase authentication required in order to make this request"
    }

    const wallet = await loadWallet(state.mnemonic)
    const [account] = await wallet.getAccounts()
    return {wallet, account}
  }

  public async getAllMetaData(): Promise<V1Beta1Metadata[]> {
    const queryClient = await bank.queryClient({addr: this.networkConfig.cosmosQAddress})
    const allData: V1Beta1Metadata[] = []

    let allDataCollection
    do {
      allDataCollection = await queryClient.queryDenomsMetadata({
        "pagination.key": allDataCollection && allDataCollection.data.pagination?.next_key ? allDataCollection.data.pagination.next_key : undefined,
      })
      if (!allDataCollection.data.pagination || !allDataCollection.data.metadatas) throw "Error on retrieving result"
      allDataCollection.data.metadatas.forEach(x => allData.push(x))
    } while (allDataCollection.data.pagination.next_key)

    return allData
  }
}
