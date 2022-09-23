import { expect } from "chai"
import {WalletStorage} from "../../../src/business/WalletStorage"
import {LocalStorageMock} from "./local-storage.mock"
import {ProviderType} from "../../../src/models/ProviderType"
import type {IWalletState} from "../../../src/business/IWalletState"

describe("Wallet storage unit tests",  function () {
    it("Should return proper provider data", async () => {
        const db = new WalletStorage(new LocalStorageMock())
        const walletData = {
            address: "networkAddress",
            chainId: "588844",
            type: ProviderType.METAMASK,
            mnemonic: "some other twelve words and it is some kind of computer magic",
            cosmosAddress: "Nowhere street"
        }
        db.updateWallet(walletData as IWalletState)

        expect(db.getWalletType()).eq(ProviderType.METAMASK)
        expect(db.getWalletState()).eql(walletData)
    })
})
