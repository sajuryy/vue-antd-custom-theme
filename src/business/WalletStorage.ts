import {ProviderType} from "../models/ProviderType"
import type {IWalletState} from "./IWalletState"
import type {IWalletStorage} from "./IWalletStorage"

export class WalletStorage implements IWalletStorage {
    public constructor(private readonly database: Storage) {}

    private static RECORD_KEY = "WalletStorage.key"

    public getWalletType(): ProviderType {
        const data = this.database.getItem(WalletStorage.RECORD_KEY)
        if(null === data) {
            return ProviderType.NONE
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const wallet = JSON.parse(data) as IWalletState
        return wallet.type
    }

    public updateWallet(walletData: IWalletState) {
        const serialized = JSON.stringify(walletData)
        this.database.setItem(WalletStorage.RECORD_KEY, serialized)
    }

    public getWalletState(): IWalletState | null {
        const data = this.database.getItem(WalletStorage.RECORD_KEY)
        if(null === data) {
            return null
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return JSON.parse(data) as IWalletState
    }
}
