import { expect } from "chai"
import {TestUtils} from "../../integration/utils/TestUtils"
import {Utils} from "../../../src/business/Utils"
import {formatTokenAmount} from "../../../src/utils/UiUtils"

describe("Wallet storage unit tests",  function () {
    it("Format decimal", async () => {
        const totalSupply = (2_000_000).toString() + (Math.pow(10, 18)).toString().substring(1)
        expect(totalSupply).eq("2000000000000000000000000")
    })

    it("IMV to AIMV very big", () => {
        const res = Utils.imvToAimv(2_000_000_000)
        expect(res).eq("2000000000000000000000000000")
    })

    it("IMV to AIMV very small", () => {
        const res = Utils.imvToAimv(0.00000006)
        expect(res).eq("60000000000")
    })

    it("Should format big amount properly", () => {
        const amount = Utils.imvToAimv(1_000_000_000)
        const formatted = formatTokenAmount(amount)
        expect(formatted).eq("1,000,000,000")
    })

    it("Should format small amount properly", () => {
        const amount = Utils.imvToAimv(0.000_000_1123)
        const formatted = formatTokenAmount(amount)
        expect(formatted).eq("1.12e-7")
    })
})
