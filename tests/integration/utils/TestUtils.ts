import type {StdFee} from "@imversed/stargate"
import {Utils} from "../../../src/business/Utils"

export class TestUtils {
    public static getDefaultFees(gas = "300000"): StdFee {
        return {
            amount: [{
                amount: Utils.imvToAimv(0.000_000_1).toString(),
                denom: "aimv"
            }],
            gas
        }
    }

    public static getTimedDenom(): string {
        const unixTime = TestUtils.getUnixTime(new Date())
        return `D${unixTime}`
    }

    public static getUnixTime(d: Date): number {
        return Math.round((d || new Date()).getTime() / 1e3)
    }
}
