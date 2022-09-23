import type {IContractDataProvider} from "../IContractDataProvider"
import type {EthLikeContractData} from "../EthLikeContractData"
import {erc20} from "../../../contracts/erc20"

export class ImversedResourcesContractDataProvider implements IContractDataProvider {
    public getNewTokenContractData<T>(): T | null {
        const {abi, bytecode} = erc20
        const ethContract = {
            contractInterface: abi,
            bytecode
        } as EthLikeContractData
        return ethContract as any
    }
}
