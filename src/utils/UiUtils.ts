import {Utils} from "../business/Utils"

const formatter = new Intl.NumberFormat("en-US")

export function formatTokenAmount(amount: string, decimals: number = Utils.DEFAULT_DECIMAL_TO_FIX): string {
    if (amount.length > decimals) {
        //format big
        const meaningPart = amount.slice(0, amount.length - decimals)
        return formatter.format(parseInt(meaningPart))
    } else {
        //format small
        return (parseInt(amount) / Math.pow(10, decimals)).toString()
    }
}

export function maskAddress(address: string, toLeftAtBegin = 5) {
    return `${address.slice(0, toLeftAtBegin)} ... ${address.slice(-6)}`
}

