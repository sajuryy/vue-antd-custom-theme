import {defineStore} from "pinia"
import type {INewTokenData} from "../models/EthToken"
import type {IBackendToken} from "../models/IBackendToken"
import type {ServiceLocator} from "../business/ServiceLocator"
import {Utils} from "../business/Utils";

export const defineTokensStore = defineStore("tokens", {
    state: () =>
        ({
            tokens: [] as IBackendToken[],
            newToken: null,
            balances: {} as Record<string,ITokenBalance>
        } as ITokensState),
    persist: true,
    getters: {
        getNewTokenData(): INewTokenData | null {
            return this.newToken
        },
        getTokensForHeader(): IBackendToken[] {
            return this.tokens.slice(0, 2)
        },
        getAllTokens(): IBackendToken[] {
            return this.tokens
        },
        getBalance: (state) => (address: string) => {
            return state.balances[address] || "0"
        },
        getAllBalance: (state) => {
            return state.balances
        }
    },
    actions: {
        async fetchTokens(verseId: string) {
            this.tokens = await this.sl?.getFactory().getBackendClient().getTokens(verseId) || []
            this.fetchBalances()
        },
        async fetchBalances() {
            for await (const token of this.tokens) {
                const tokenPair = await this.sl?.getFactory().getBankClient().getTokenPair(token.contractAddress)
                if (tokenPair && tokenPair.denom) {
                    this.balances[token.contractAddress ] = {
                        eth: parseInt(await this.sl?.getFactory().getTokenClient().getOwnBalanceInContract(token.contractAddress) || "0") / Math.pow(10, Utils.DEFAULT_DECIMAL_TO_FIX),
                        native: parseInt((await this.sl?.getFactory().getBankClient().getBalanceByToken(tokenPair.denom))?.amount || "0") / Math.pow(10, Utils.DEFAULT_DECIMAL_TO_FIX),
                        denom: tokenPair.denom
                    }
                }
            }
        },
        search(value: string) {
            if (value) {
                return this.tokens.filter(t => {
                    const searchRegexp = new RegExp(value, "i")
                    return searchRegexp.test(t.name) || searchRegexp.test(t.symbol) || searchRegexp.test(t.contractAddress)
                })
            }
            return this.tokens
        },
        setTokens(tokens: IBackendToken[]) {
            this.tokens = tokens
        },
        setNewTokenData(tokenData: INewTokenData) {
            this.newToken = tokenData
        },
        addToken(token: IBackendToken) {
            this.tokens = [token, ...this.tokens]
        }
    },
})

interface ITokensState {
    tokens: IBackendToken[]
    newToken: INewTokenData | null
    balances: Record<string, ITokenBalance>
    sl?: ServiceLocator
}

interface ITokenBalance {
    eth: number
    native: number
    denom: string
}