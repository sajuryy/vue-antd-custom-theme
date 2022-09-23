import {networks} from "../../../src/configs/networks"
import {NetworkName} from "../../../src/business/INetworksConfig"
import type {INetworksConfig} from "../../../src/business/INetworksConfig"
import {expect} from "chai"
import {TestTransactionSignerProvider} from "../utils/TestTransactionSignerProvider"
import {BackendClient} from "../../../src/business/networks/IBackendClient"
import type {IPostTokenCreatedData} from "../../../src/business/networks/IBackendClient"


const testData = require("../TestData.json")

describe("Tokens", () => {
    describe("getting", () => {
        it("returns verses list for account and network", async () => {
            const config = networks.find((n: INetworksConfig) => n.name === NetworkName.IMVERSED_TESTNET)!
            const backendClient = new BackendClient(config, TestTransactionSignerProvider.instance)

            const tokens = await backendClient.getTokens("someVerseId")

            expect(tokens).to.be.an("array")
        })

    })
    describe("creating", () => {
        it("fails to create verse because of duplication key error", async () => {
            const config = networks.find((n: INetworksConfig) => n.name === NetworkName.IMVERSED_TESTNET)!
            const backendClient = new BackendClient(config, TestTransactionSignerProvider.instance)
            const tokenData: IPostTokenCreatedData = {
                ownerAccountAddress: testData.ethAccountAddress,
                name: "Some Test Token",
                iconUrl: "",
                network: config.name,
                verseId: "someVerseId",
                contractAddress: "0xslkjdfb0495kfjgn",
                decimals: 18,
                symbol: "STT"
            }

            try {
                const res = await backendClient.postTokenCreated(tokenData)
                throw new Error("should not pass")
            } catch (e: any) {
                expect(e.response.data.status).to.be.eq(409)
            }
        })
    })

})

