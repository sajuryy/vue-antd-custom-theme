import {TestUtils} from "../utils/TestUtils"
import type {CreateEthTokenData} from "../../../src/business/networks/CreateEthTokenData"
import {TestTransactionSignerProvider} from "../utils/TestTransactionSignerProvider"
import {TestContractDataProvider} from "../utils/TestContractDataProvider"
import type {IEthToken} from "../../../src/models/EthToken"
import {ImversedEthDataReader} from "../../../src/business/networks/imversed/ImversedEthDataReader"
import {ImversedTokensClient} from "../../../src/business/networks/imversed/tokens/ImversedTokensClient"
import {expect} from "chai"
import {Utils} from "../../../src/business/Utils"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testData = require("../TestData.json")

describe.only("Create ETH token tests", function () {
    this.timeout(300_000)

    it("Should create a token by deploying ERC20 contract", async () => {
        const denom = TestUtils.getTimedDenom()

        const newTokenData = {
            name: denom,
            symbol: denom.substring(0, 4),
            decimals: 18,
            supply: Utils.imvToAimv(2_000_000_000)
        } as CreateEthTokenData

        const client = new ImversedTokensClient(
            TestTransactionSignerProvider.instance,
            new ImversedEthDataReader(testData.testnetEthTransactionExplorer),
            TestContractDataProvider.instance)

        const flow = await client.createNewToken(newTokenData)

        for(let i = 0; i < flow.operationSteps.length; i++) {
            const step = flow.operationSteps[i]
            console.log(`Step ${i}: ${step.id}`)
            await step.run()
        }

        const res = flow.retrieveResult()

        expect(res).not.null
        // @ts-ignore
        expect(res.address).not.null

        console.log(res)
    })

    it("Should read newly created contract", async () => {
        const denom = TestUtils.getTimedDenom()

        const newTokenData = {
            name: denom,
            symbol: denom.substring(0, 4),
            decimals: 18,
            supply: Utils.imvToAimv(2_000_000_000)
        } as CreateEthTokenData

        const client = new ImversedTokensClient(
            TestTransactionSignerProvider.instance,
            new ImversedEthDataReader(testData.testnetEthTransactionExplorer),
            TestContractDataProvider.instance)

        const flow = await client.createNewToken(newTokenData)

        for(let i = 0; i < flow.operationSteps.length; i++) {
            await flow.operationSteps[i].run()
        }

        const deployedContract = flow.retrieveResult()

        if(null === deployedContract) {
            throw "Error on retrieving result"
        }

        let newContract: IEthToken | undefined = undefined

        for (let i = 0; i < 10; i++) {
            const myContracts = await client.getListOfOwnTokens()
            newContract = myContracts.find(x => x.contractAddress === deployedContract.address.toLowerCase())
            if (newContract) {
                break
            }

            await new Promise(function (resolve, _) {
                setTimeout(function () {
                    resolve(null)
                }, 1000)
            })
        }

        expect(newContract).not.undefined

        console.log(newContract)
    })
})
