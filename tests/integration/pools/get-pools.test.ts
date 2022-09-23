import { expect } from "chai"
import { loadWallet, pools} from "@imversed/js-client"
import {CosmosTestUtils} from "../utils/CosmosTestUtils"

const testData = require("../TestData.json")

describe("Get pools tests", function () {
    this.timeout(300_000)

    it("Should return list of pools by current user", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const queryClient = await pools.queryClient({ addr: testData.testnetQueryAddress })

        const coin1 = await CosmosTestUtils.createCosmosTestCoin(wallet, testData.testnetAddress, account.address)
        const coin2 = await CosmosTestUtils.createCosmosTestCoin(wallet, testData.testnetAddress, account.address)
        const { id } = await CosmosTestUtils.createCosmosPool(wallet, testData.testnetAddress, coin1.denom, coin2.denom)

        // @ts-ignore
        const allPools: any[] = []

        let poolsPage
        do {
            poolsPage = await queryClient.queryPools({
                "pagination.key": poolsPage && poolsPage.data.pagination?.next_key  ? poolsPage.data.pagination.next_key : undefined,
                "pagination.limit": "10"
            })
            if(!poolsPage.data.pools) throw "Pools retrieving error"
            poolsPage.data.pools.forEach(x => allPools.push(x))
        } while (poolsPage.data.pagination?.next_key)

        const createdPool = allPools.find(x => x.id === id)
        expect(createdPool || null).not.null

        allPools.forEach(x => console.log(x))
    })
})
