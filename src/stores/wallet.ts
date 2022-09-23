import {defineStore} from "pinia"
import {ProviderType} from "../models/ProviderType"
import type {IWalletState} from "../business/IWalletState";

export const defineWalletStore = defineStore("wallet-state", {
    state: () =>
        ({
            address: "",
            chainId: "",
            isConnected: false,
            type: ProviderType.NONE,
            cosmosAddress: ""
        } as unknown as IUiWalletState),
    persist: true,
    getters: {
        getAddress(): string {
            return this.address
        },
        getIsConnected(): boolean {
            return this.type !== ProviderType.NONE
        }
    },
    actions: {
        updateState(account: IWalletState) {
            this.cosmosAddress = account.cosmosAddress
            this.type = ProviderType.MNEMONIC
            this.address = account.address
            this.chainId = "5555558"
        },
        disconnectWallet() {
            this.address = ""
            this.type = ProviderType.NONE
            this.cosmosAddress = ""
        }
    },
})

export interface IUiWalletState {
    address: string
    chainId: string
    type: ProviderType
    cosmosAddress: string
}
