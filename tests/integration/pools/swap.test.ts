import {expect} from "chai"
import {bank, loadWallet, pools} from "@imversed/js-client"
import {TestUtils} from "../utils/TestUtils"
import {CosmosTestUtils} from "../utils/CosmosTestUtils"
import type {MsgSwapExactAmountIn} from "@imversed/js-client/lib/pools/types/pools/v1beta1/tx"
import {BigNumber} from "ethers"
import {Utils} from "../../../src/business/Utils"
import {ImversedPoolsClient} from "../../../src/business/networks/imversed/pools/ImversedPoolsClient"
import type {IWalletStorage} from "../../../src/business/IWalletStorage"
import type {IWalletState} from "../../../src/business/IWalletState"
import type {INetworksConfig} from "../../../src/business/INetworksConfig"
import {ProviderType} from "../../../src/models/ProviderType"

const testData = require("../TestData.json")

describe("Create pools tests",   function () {
    this.timeout(300_000)

    it("Should swap in pools", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()
        const poolsTxClient = await pools.txClient(wallet, { addr: testData.testnetAddress })
        const bankQuery = await bank.queryClient({ addr: testData.testnetQueryAddress })

        const coin1 = await CosmosTestUtils.createCosmosTestCoin(wallet, testData.testnetAddress, account.address)
        const coin2 = await CosmosTestUtils.createCosmosTestCoin(wallet, testData.testnetAddress, account.address)
        const { id } = await CosmosTestUtils.createCosmosPool(wallet, testData.testnetAddress, coin1.denom, coin2.denom)

        const swapMessage = await poolsTxClient.msgSwapExactAmountIn({
            sender: account.address,
            routes: [ { tokenOutDenom: coin2.denom, poolId: id } ],
            tokenIn: { denom: coin1.denom, amount: Utils.imvToAimv(20_000) },
            tokenOutMinAmount: Utils.imvToAimv(1_000)
        } as MsgSwapExactAmountIn)

        const tx = await poolsTxClient.signAndBroadcast([ swapMessage ], { fee: TestUtils.getDefaultFees() })
        const balance1 = await bankQuery.queryBalance(account.address, { denom: coin1.denom })
        const balance2 = await bankQuery.queryBalance(account.address, { denom: coin2.denom })

        console.log(balance1.data)
        console.log(balance2.data)

        // @ts-ignore
        const diff = BigNumber.from(balance2.data.balance.amount).sub(BigNumber.from(balance1.data.balance.amount))

        expect(diff.gte(BigNumber.from(0))).true

        console.log(tx)
    })

    it.skip("Should swap aimv to the special pool", async () => {
        const poolsQuery = await pools.queryClient({ addr: testData.testnetQueryAddress })

        const walletStorageMock = {
            getWalletState: () => {
                return { mnemonic: testData.testnetMnemonic, type: ProviderType.MNEMONIC } as IWalletState
            }
        } as IWalletStorage

        const mockConfig = { cosmosTxAddress: testData.testnetAddress, cosmosQAddress: testData.testnetQueryAddress } as INetworksConfig

        const client = new ImversedPoolsClient(walletStorageMock, mockConfig)
        const flow = await client.swap(43, "ASU", { denom: "aimv", amount: Utils.imvToAimv(200) })

        for (const operationStep of flow.operationSteps) {
            const stepRes = await operationStep.run()
            console.log(stepRes)
        }
    })
})
