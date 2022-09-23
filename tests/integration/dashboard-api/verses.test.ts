import {networks} from "../../../src/configs/networks"
import {NetworkName} from "../../../src/business/INetworksConfig";
import type {INetworksConfig} from "../../../src/business/INetworksConfig";
import {expect} from "chai";
import {TestTransactionSignerProvider} from "../utils/TestTransactionSignerProvider"
import {BackendClient} from "../../../src/business/networks/IBackendClient";
import type {ICreateVerseData} from "../../../src/business/networks/IBackendClient";

const testData = require("../TestData.json")

describe("Verses", () => {
    describe("getting", () => {

        it("returns verses list for account and network", async () => {
            const config = networks.find((n: INetworksConfig) => n.name === NetworkName.IMVERSED_TESTNET)!
            const backendClient = new BackendClient(config, TestTransactionSignerProvider.instance)

            const verses = await backendClient.getVerses(NetworkName.IMVERSED_TESTNET, "0xkjherfihw8jh9438")

            expect(verses).to.be.an("array")
        })

    })
    describe("creating", () => {
        it("fails to create verse because of duplication key error", async () => {
            const config = networks.find((n: INetworksConfig) => n.name === NetworkName.IMVERSED_TESTNET)!
            const backendClient = new BackendClient(config, TestTransactionSignerProvider.instance)
            const verseData: ICreateVerseData = {
                ownerAccountAddress: testData.ethAccountAddress,
                name: "Some Verse",
                iconUrl: "",
                network: config.name
            }
            try {
                await backendClient.createVerse(verseData)
                throw new Error("should not pass")
            } catch (e: any) {
                expect(e.response.data.status).to.be.eq(409)
            }
        })
    })

})

