import { expect } from "chai"
import {bank, loadWallet, pools} from "@imversed/js-client"
import type {PoolParams} from "@imversed/js-client/lib/pools/types/pools/v1beta1/pool"
import {TestUtils} from "../utils/TestUtils"
import {CosmosTestUtils} from "../utils/CosmosTestUtils"
import {Utils} from "../../../src/business/Utils"

const testData = require("../TestData.json")

describe("Create pools tests", function () {
    this.timeout(300_000)

    it("Should create a pool for a token pair", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const coin1 = await CosmosTestUtils.createCosmosTestCoin(wallet, testData.testnetAddress, account.address)
        const coin2 = await CosmosTestUtils.createCosmosTestCoin(wallet, testData.testnetAddress, account.address)

        const poolsTxClient = await pools.txClient(wallet, { addr: testData.testnetAddress })
        const createPoolMessage = poolsTxClient.msgCreatePool({
            poolAssets: [
                {
                token: { amount: Utils.imvToAimv(20_000), denom: coin1.denom },
                weight: "1"
                },
                {
                    token: { amount: Utils.imvToAimv(20_000), denom: coin2.denom },
                    weight: "1"
                }],
            poolParams: {
                swapFee: Utils.imvToAimv(0.0001),
                exitFee: Utils.imvToAimv(0.0002)
            } as PoolParams,
            sender: account.address
        })

        const tx = await poolsTxClient.signAndBroadcast([ createPoolMessage ], { fee: TestUtils.getDefaultFees() })

        const events = JSON.parse(tx.rawLog)[0].events as any[]
        const poolCreatedEvent = events.find(x => x.type === "pool_created") as any
        const id = poolCreatedEvent.attributes[0].value

        const queryClient = await pools.queryClient({ addr: testData.testnetQueryAddress })
        const createdPool = await queryClient.queryPool(id)

        // @ts-ignore
        expect(createdPool.data.id).not.null
        console.log(createdPool.data)
    })

    it("Should create a pool for the special token pair", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const poolsTxClient = await pools.txClient(wallet, { addr: testData.testnetAddress })
        const createPoolMessage = poolsTxClient.msgCreatePool({
            poolAssets: [
                {
                    token: { amount: Utils.imvToAimv(20_000), denom: "ASU" },
                    weight: "1"
                },
                {
                    token: { amount: Utils.imvToAimv(20_000), denom: "aimv" },
                    weight: "1"
                }],
            poolParams: {
                swapFee: Utils.imvToAimv(0.0001),
                exitFee: Utils.imvToAimv(0.0002)
            } as PoolParams,
            sender: account.address
        })
        const fee = TestUtils.getDefaultFees()
        const tx = await poolsTxClient.signAndBroadcast([ createPoolMessage ], { fee })

        const events = JSON.parse(tx.rawLog)[0].events as any[]
        const poolCreatedEvent = events.find(x => x.type === "pool_created") as any
        const id = poolCreatedEvent.attributes[0].value

        const queryClient = await pools.queryClient({ addr: testData.testnetQueryAddress })
        const createdPool = await queryClient.queryPool(id)

        // @ts-ignore
        expect(createdPool.data.id).not.null
        console.log(createdPool.data)
    })
})
