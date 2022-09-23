import type {IContractNames} from "@/stores/metaData"

export function getReadableErc20Name(denom: string, contractsNames: IContractNames) {
    const regexp = new RegExp(/^erc20\//)
    if(contractsNames[denom.replace(regexp, "").toLowerCase()]){
        const contractName = contractsNames[denom.replace(regexp, "").toLowerCase()]
        return `${contractName.name}(${contractName.symbol})`
    }
    return denom.length > 12? `${denom.slice(0, 5) + "..." + denom.slice(-6)}` : denom
}