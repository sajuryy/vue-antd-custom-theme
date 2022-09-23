import type {V1Beta1Coin} from "@imversed/js-client/lib/bank/rest"

export interface ISwapResult {
    fromBalance: V1Beta1Coin
    toBalance: V1Beta1Coin
}
