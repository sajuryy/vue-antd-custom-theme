import type {ITransactionSignerProvider} from "../../../src/business/networks/ITransactionSignerProvider"
import {providers, Wallet} from "ethers"

const testData = require("../TestData.json")

export class TestTransactionSignerProvider implements ITransactionSignerProvider {
    async getSigner<T>(): Promise<T | null> {
        const wallet = Wallet.fromMnemonic(testData.testnetMnemonic, "m/44'/60'/0'/0/0")
        const web3Provider = new providers.JsonRpcProvider(testData.testnetEthAddress)
        return new Wallet(wallet.privateKey, web3Provider) as any
    }

    public static get instance(): TestTransactionSignerProvider {
        return new TestTransactionSignerProvider()
    }
}
