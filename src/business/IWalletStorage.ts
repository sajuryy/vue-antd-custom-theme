import type {ProviderType} from "@/models/ProviderType"
import type {IWalletState} from "./IWalletState"

export interface IWalletStorage {
    getWalletType(): ProviderType | null

    getWalletState(): IWalletState | null

    updateWallet(walletData: IWalletState): void
}
