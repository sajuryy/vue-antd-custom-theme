import type {IOperationFlow} from "../../engine/IOperationFlow"
import {GeneralOperationsFlow} from "../../engine/IOperationFlow"
import {bank, loadWallet, pools} from "@imversed/js-client"
import type {Pool, PoolAsset, PoolParams} from "@imversed/js-client/lib/pools/types/pools/v1beta1/pool"
import {Utils} from "../../../Utils"
import type {IWalletStorage} from "../../../IWalletStorage"
import {ProviderType} from "../../../../models/ProviderType"
import type {INetworksConfig} from "../../../INetworksConfig"
import {GeneralOperationStep} from "../../engine/IOperationStep"
import type {IOperationFlowState} from "../../engine/IOperationFlowState"
import type {ICreatedPoolData} from "./ICreatedPoolData"
import type {MsgSwapExactAmountIn} from "@imversed/js-client/lib/pools/types/pools/v1beta1/tx"
import type {Coin} from "@imversed/js-client/lib/bank/types/cosmos/base/v1beta1/coin"
import type {ISwapResult} from "./ISwapResult"

export class ImversedPoolsClient {
    public constructor(private readonly walletStore: IWalletStorage, private readonly networkConfig: INetworksConfig) {
    }

    public async getPoolById(id: number): Promise<Pool> {
        const queryClient = await pools.queryClient({ addr: this.networkConfig.cosmosQAddress })
        const resp = await queryClient.queryPool(id.toString())
        return resp.data.pool as Pool
    }

    public async getAllPools(): Promise<Pool[]> {
        const queryClient = await pools.queryClient({ addr: this.networkConfig.cosmosQAddress })
        const allPools: Pool[] = []

        let poolsPage
        do {
            poolsPage = await queryClient.queryPools({
                "pagination.key": poolsPage && poolsPage.data.pagination?.next_key  ? poolsPage.data.pagination.next_key : undefined
            })
            if(!poolsPage.data.pools) throw "Pools retrieving error"
            poolsPage.data.pools.forEach(x => allPools.push(x as Pool))
        } while (poolsPage.data.pagination?.next_key)

        return allPools
    }

    public async swap(poolId: number, tokenOutDenom: string, tokenIn: Coin): Promise<IOperationFlow<ISwapResult | null>> {
        const state =  this.walletStore.getWalletState()
        if(null === state || state.type !== ProviderType.MNEMONIC) {
            throw "Recovery phrase authentication required in order to make this request"
        }

        const wallet = await loadWallet(state.mnemonic)
        const [account] = await wallet.getAccounts()

        const interstepState = new SwapInterstepState()

        const step1 = new GeneralOperationStep<SwapInterstepState>("swap-coins-1",  async (state) => {
            const poolsTxClient = await pools.txClient(wallet, { addr: this.networkConfig.cosmosTxAddress })
            const swapMessage = await poolsTxClient.msgSwapExactAmountIn({
                sender: account.address,
                routes: [ { tokenOutDenom, poolId } ],
                tokenIn,
                tokenOutMinAmount: "10"
            } as MsgSwapExactAmountIn)

            const fee = {
                amount: [{
                    amount: Utils.imvToAimv(0.000_1).toString(),
                    denom: "aimv"
                }],
                gas: "200000"
            }

            const tx = await poolsTxClient.signAndBroadcast([ swapMessage ], { fee })
            state.swapTx = tx
            return tx
        }, interstepState)

        const step2 = new GeneralOperationStep<SwapInterstepState>("swap-coins-1",  async (state) => {
            const bankQuery = await bank.queryClient({ addr: this.networkConfig.cosmosQAddress })
            const toBalance = await bankQuery.queryBalance(account.address, { denom: tokenOutDenom })
            const fromBalance = await bankQuery.queryBalance(account.address, { denom: tokenIn.denom })
            if(!fromBalance.data.balance || !toBalance.data.balance) throw "Cannot receive balances"
            const res = { fromBalance: fromBalance.data.balance, toBalance: toBalance.data.balance }
            state.result = res
            return res
        }, interstepState)


        return new GeneralOperationsFlow<ISwapResult | null>([ step1, step2 ], interstepState, () => {
            return interstepState.result
        })
    }

    public async createPool(coin1: PoolAsset, coin2: PoolAsset, poolParams: PoolParams | null = null): Promise<IOperationFlow<ICreatedPoolData | null>> {
        const state =  this.walletStore.getWalletState()
        if(null === state || state.type !== ProviderType.MNEMONIC) {
            throw "Recovery phrase authentication required in order to make this request"
        }

        const interstepState = new CreatePoolInterstepState()

        const step1 = new GeneralOperationStep<CreatePoolInterstepState>("create-pool-1", async xState => {
            const wallet = await loadWallet(state.mnemonic)
            const [account] = await wallet.getAccounts()

            const poolsTxClient = await pools.txClient(wallet, { addr: this.networkConfig.cosmosTxAddress })

            const createPoolMessage = poolsTxClient.msgCreatePool({
                poolAssets: [coin1, coin2],
                poolParams: poolParams || {
                    swapFee: Utils.imvToAimv(0.0001),
                    exitFee: Utils.imvToAimv(0.0002)
                } as PoolParams,
                sender: account.address
            })
            // TODO: estimate gas
            const fee = {
                amount: [{
                    amount: Utils.imvToAimv(0.000_1).toString(),
                    denom: "aimv"
                }],
                gas: "400000"
            }

            const tx = await poolsTxClient.signAndBroadcast([ createPoolMessage ], { fee })
            xState.createPoolTx = tx
            return tx
        }, interstepState)

        const step2 = new GeneralOperationStep("create-pool-2", async xState => {
            if(xState.createPoolTx.code !== 0) {
                console.log(xState.createPoolTx)
                throw "Pool creation transaction fails"
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const txRawLog = xState.createPoolTx.rawLog
            const events = JSON.parse(txRawLog)[0].events as any[]
            const poolCreatedEvent = events.find(x => x.type === "pool_created") as any
            const id = poolCreatedEvent.attributes[0].value
            xState.result = { id }
        }, interstepState)


        return new GeneralOperationsFlow<ICreatedPoolData | null>([step1, step2 ], interstepState, () => {
            return interstepState.result
        })
    }
}

class CreatePoolInterstepState implements IOperationFlowState {
    createPoolTx: any
    result: ICreatedPoolData | null = null

    public deserialize(content: string): void {
        throw "Not implemented"
    }

    public serialize(): string {
        throw "Not implemented"
    }
}

class SwapInterstepState implements IOperationFlowState {
    result: ISwapResult | null = null
    swapTx: any

    public deserialize(content: string): void {
        throw "Not implemented"
    }

    public serialize(): string {
        throw "Not implemented"
    }
}
