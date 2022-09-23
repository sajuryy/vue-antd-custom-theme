import { expect } from "chai"

import {loadWallet, tx, bank, currency, pools} from "@imversed/js-client"
import type {Coin} from "@imversed/js-client/lib/pools/types/cosmos/base/v1beta1/coin"
import type {MsgIssue, MsgMint} from "@imversed/js-client/lib/currency/types/currency/tx"
import {TestUtils} from "../utils/TestUtils"
import type {V1Beta1TxResponse} from "@imversed/js-client/lib/tx/rest"
import {Utils} from "../../../src/business/Utils"

const testData = require("../TestData.json")

describe("Create cosmos only token tests", function () {
    this.timeout(30_000)

    it("Should create a token", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const txClient = await currency.txClient(wallet, { addr: testData.testnetAddress })

        const denom = TestUtils.getTimedDenom()

        const issueMessage = txClient.msgIssue({
            sender: account.address,
            denom: denom,
            icon: `tokens.imversed.com/icon/${denom}`
        } as MsgIssue)

        // 1 million with 18 decimals
        const amountToIssue = Utils.imvToAimv(1)

        const mintMessage = txClient.msgMint({
            sender: account.address,
            coin: {denom, amount: amountToIssue.toString()} as Coin
        } as MsgMint)

        const result = await txClient.signAndBroadcast(
            [issueMessage, mintMessage],
            {
                fee: {
                    amount: [{
                        amount: Utils.imvToAimv(0.000_000_1).toString(),
                        denom: "aimv"
                    }],
                    gas: (2_000_000).toString()
                }
            }
        )

        if(result.code !== 0) {
            console.error(`Denom: ${denom}`)
            console.error(result)
        }

        expect(result.code).eq(0)

        const hash: string = result.transactionHash

        const qClient = await tx.queryClient({ addr: testData.testnetQueryAddress })

        let txResponse: V1Beta1TxResponse | null = null

        for(let i = 0; i < 10; i++) {
            try {
                const transactionStatus = await qClient.serviceGetTx(hash)
                if(transactionStatus.data.tx_response) {
                    txResponse = transactionStatus.data.tx_response
                    break
                }
            }
            catch (_) { }
        }

        expect(txResponse).not.null
        // @ts-ignore
        expect(txResponse.code).eq(0)
        // @ts-ignore
        expect(parseInt(txResponse.height)).gt(0)

        console.log(txResponse)

    })

    it.skip("Should create a special token", async () => {
        const wallet = await loadWallet(testData.testnetMnemonic)
        const [account] = await wallet.getAccounts()

        const txClient = await currency.txClient(wallet, { addr: testData.testnetAddress })

        const denom = "ASU"

        const issueMessage = txClient.msgIssue({
            sender: account.address,
            denom: denom,
            icon: `tokens.imversed.com/icon/${denom}`
        } as MsgIssue)

        const mintMessage = txClient.msgMint({
            sender: account.address,
            coin: {denom, amount: Utils.imvToAimv(100_000_000)} as Coin
        } as MsgMint)

        const fee = {
            amount: [{ amount: Utils.imvToAimv(0.000_000_1).toString(), denom: "aimv" }],
            gas: (2_000_000).toString()
        }

        const result = await txClient.signAndBroadcast( [issueMessage, mintMessage], { fee } )

        if(result.code !== 0) {
            console.error(`Denom: ${denom}`)
            console.error(result)
        }

        expect(result.code).eq(0)

        const hash: string = result.transactionHash

        const qClient = await tx.queryClient({ addr: testData.testnetQueryAddress })

        let txResponse: V1Beta1TxResponse | null = null

        for(let i = 0; i < 10; i++) {
            try {
                const transactionStatus = await qClient.serviceGetTx(hash)
                if(transactionStatus.data.tx_response) {
                    txResponse = transactionStatus.data.tx_response
                    break
                }
            }
            catch (_) { }
        }

        expect(txResponse).not.null
        // @ts-ignore
        expect(txResponse.code).eq(0)
        // @ts-ignore
        expect(parseInt(txResponse.height)).gt(0)

        console.log(txResponse)

    })
})
