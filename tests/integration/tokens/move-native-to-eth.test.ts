import {expect} from "chai"
import {bank, loadWallet} from "@imversed/js-client"
import {ImversedBankClient} from "../../../src/business/networks/imversed/bank/ImversedBankClient"
import {ProviderType} from "../../../src/models/ProviderType"
import type {IWalletState} from "../../../src/business/IWalletState"
import type {IWalletStorage} from "../../../src/business/IWalletStorage"
import type {INetworksConfig} from "../../../src/business/INetworksConfig"
import {Utils} from "../../../src/business/Utils"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testData = require("../TestData.json")

describe("Move ETH token tests", function () {
    this.timeout(30_000)

    it("Move assets from cosmos to contract", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const walletStorageMock = {
            getWalletState: () => {
                return {mnemonic: testData.testnetMnemonic, type: ProviderType.MNEMONIC} as IWalletState
            }
        } as IWalletStorage

        const mockConfig = {
            cosmosTxAddress: testData.testnetAddress,
            cosmosQAddress: testData.testnetQueryAddress
        } as INetworksConfig

        const ethContractAddress = "0x344fa88Bb5308c758926Fd45b22C655F0450bcBD"
        const denom = `erc20/${ethContractAddress}`

        const bankQuery = await bank.queryClient({addr: testData.testnetQueryAddress})
        const balanceBeforeResp = await bankQuery.queryBalance(account.address, { denom })
        const balanceBefore = balanceBeforeResp.data.balance?.amount || "0"

        const client = new ImversedBankClient(walletStorageMock, mockConfig)

        const amount = Utils.imvToAimv(100)
        const res = await client.moveAssetsFromCosmosToEth(amount, denom)

        // console.log(res)

        const balanceAfterResp = await bankQuery.queryBalance(account.address, { denom })
        const balanceAfter = balanceAfterResp.data.balance?.amount
        // @ts-ignore
        console.log("balanceBefore", balanceBefore)
        // @ts-ignore
        console.log("balanceAfter", balanceAfter)
        console.log("amount", amount)

        // @ts-ignore
        expect(balanceBefore - amount).eq(parseInt(balanceAfter))

        await client.moveAssetsFromEthToCosmos(amount, ethContractAddress)
    })
})
