import {providers, Wallet} from "ethers"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js"
import type {ITransactionSignerProvider} from "./networks/ITransactionSignerProvider"
import type {IWalletStorage} from "./IWalletStorage"
import type {INetworksConfig} from "./INetworksConfig"
import {ProviderType} from "@/models/ProviderType"

export class UiTransactionSignerProvider implements ITransactionSignerProvider {
    public constructor(private readonly eth: any,
                       private readonly walletStorage: IWalletStorage,
                       private readonly configProvider: INetworksConfig) {
    }

    public async getSigner<T>(): Promise<T | null> {
        const state = this.walletStorage.getWalletState()

        if (null === state) return null

        switch (state.type) {
            case ProviderType.METAMASK: {
                const web3Provider = new providers.Web3Provider(this.eth)
                return (await web3Provider.getSigner()) as unknown as T
            }
            case ProviderType.WALLET_CONNECT: {
                const provider = new WalletConnectProvider({
                    rpc: {5555558: this.configProvider.ethAddress},
                    chainId: 5555558,
                })
                await provider.enable()
                const web3Provider = new providers.Web3Provider(provider)
                return (await web3Provider.getSigner()) as unknown as T
            }
            case ProviderType.MNEMONIC: {
                this.walletStorage.getWalletType()
                const wallet = Wallet.fromMnemonic(state.mnemonic, "m/44'/60'/0'/0/0")
                const privateKey = wallet.privateKey

                const web3Provider = new providers.JsonRpcProvider(this.configProvider.ethAddress)
                return new Wallet(privateKey, web3Provider) as unknown as T
            }
            case ProviderType.NONE:
            default:
                return null
        }
    }
}
