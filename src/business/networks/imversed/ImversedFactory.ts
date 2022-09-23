import type {INetworksConfig} from "../../INetworksConfig"
import type {ITokensClient} from "../ITokensClient"
import {ImversedTokensClient} from "./tokens/ImversedTokensClient"
import type {ITokenDataReader} from "./tokens/ITokenDataReader"
import {ImversedEthDataReader} from "./ImversedEthDataReader"
import type {IContractDataProvider} from "../IContractDataProvider"
import {ImversedResourcesContractDataProvider} from "./ImversedResourcesContractDataProvider"
import type {ITransactionSignerProvider} from "../ITransactionSignerProvider"
import type {IWalletStorage} from "../../IWalletStorage"
import {WalletStorage} from "../../WalletStorage"
import {UiTransactionSignerProvider} from "../../UiTransactionSignerProvider"
import {ImversedPoolsClient} from "./pools/ImversedPoolsClient"
import {ImversedBankClient} from "./bank/ImversedBankClient"
import {BackendClient} from "../IBackendClient"
import type {IBackendClient} from "../IBackendClient"

export class ImversedFactory {
    public constructor(public readonly database: Storage, public readonly windowProvider: Window, private readonly config: INetworksConfig) {
    }

    public getBackendClient(): IBackendClient {
        return new BackendClient(this.config, this.getTransactionSignerProvider())
    }

    public getPoolsClient(): ImversedPoolsClient {
        return new ImversedPoolsClient(this.getWalletStorage(), this.config)
    }

    public getBankClient(): ImversedBankClient {
        return new ImversedBankClient(this.getWalletStorage(), this.config)
    }

    public getTokenClient(): ITokensClient {
        return new ImversedTokensClient(this.getTransactionSignerProvider(), this.getTokenDataReader(), this.getContractsDataProvider())
    }

    public getTokenDataReader(): ITokenDataReader {
        return new ImversedEthDataReader(this.config.ethExplorerAddress)
    }

    private getContractsDataProvider(): IContractDataProvider {
        return new ImversedResourcesContractDataProvider()
    }

    public   getTransactionSignerProvider(): ITransactionSignerProvider {
        // TODO: Window provider logic
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const eth = this.windowProvider.ethereum

        return new UiTransactionSignerProvider(eth, this.getWalletStorage(), this.config)
    }

    public getWalletStorage(): IWalletStorage {
        return new WalletStorage(this.database)
    }
}
