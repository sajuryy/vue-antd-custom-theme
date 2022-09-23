import {currency, IWallet, pools} from "@imversed/js-client"
import type { MsgIssue, MsgMint} from "@imversed/js-client/lib/currency/types/currency/tx"
import type {Coin} from "@imversed/js-client/lib/pools/types/cosmos/base/v1beta1/coin"
import {TestUtils} from "./TestUtils"
import type {PoolParams} from "@imversed/js-client/lib/pools/types/pools/v1beta1/pool"
import {Utils} from "../../../src/business/Utils"

export class CosmosTestUtils {
    public static async createCosmosPool(wallet: IWallet, networkAddress: string, denom1: string, denom2: string, accountAddress: string | null = null): Promise<{ id: number }> {
        const allAccounts = await wallet.getAccounts()
        const account = accountAddress ? allAccounts.find(x => x.address === accountAddress) : allAccounts[0]
        if (!account) {
            throw "Account not found"
        }

        const poolsTxClient = await pools.txClient(wallet, { addr: networkAddress })
        const createPoolMessage = poolsTxClient.msgCreatePool({
            poolAssets: [
                {
                    token: { amount: Utils.imvToAimv(2_000_000), denom: denom1 },
                    weight: "1"
                },
                {
                    token: { amount: Utils.imvToAimv(2_000_000), denom: denom2 },
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
        return { id }
    }

    public static async createCosmosTestCoin(wallet: IWallet, networkAddress: string, accountAddress: string | null = null): Promise<{ denom: string, hash: string }> {
        const txClient = await currency.txClient(wallet, { addr: networkAddress })
        const allAccounts = await wallet.getAccounts()
        const account = accountAddress ? allAccounts.find(x => x.address === accountAddress) : allAccounts[0]
        if (!account) {
            throw "Account not found"
        }

        const denom = TestUtils.getTimedDenom()

        const issueMessage = txClient.msgIssue({
            sender: account.address,
            denom: denom,
            icon: `tokens.imversed.com/icon/${denom}`
        } as MsgIssue)


        // TODO: fix issue in lib and change 1 to 1 mil
        const amountToIssue = Utils.imvToAimv(10_000_000)

        const mintMessage = txClient.msgMint({
            sender: account.address,
            coin: {denom, amount: amountToIssue} as Coin
        } as MsgMint)

        const fee = {
            amount: [{
                amount: Utils.imvToAimv(0.000_000_1).toString(),
                denom: "aimv"
            }],
            gas: (2_000_000).toString()
        }

        const result = await txClient.signAndBroadcast(
            [issueMessage, mintMessage],
            {fee}
        )

        if (result.code !== 0) {
            console.error(result)
            throw `Transaction fails with code ${result.code}`
        }

        return {
            denom,
            hash: result.transactionHash
        }
    }
}
