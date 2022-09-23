import {bank, loadWallet, pools} from "@imversed/js-client"
import type {V1Beta1Coin} from "@imversed/js-client/lib/bank/rest"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testData = require("../TestData.json")

describe("Wallet tests", function () {
    this.timeout(30_000)

    it("Should list user assets", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const queryClient = await bank.queryClient({ addr: testData.testnetQueryAddress })
        const allTokens: V1Beta1Coin[] = []

        let res
        do {
            res = await queryClient.queryAllBalances(account.address, {
                "pagination.key": res && res.data.pagination?.next_key  ? res.data.pagination.next_key : undefined,
            })
            if(!res.data.pagination || !res.data.balances) throw "Error on retrieving result"
            res.data.balances.forEach(x => allTokens.push(x))
        } while (res.data.pagination.next_key)

        console.log(allTokens)
    })
})
