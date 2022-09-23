import type {IContractDataProvider} from "../../../src/business/networks/IContractDataProvider"
import {erc20} from "../../../src/contracts/erc20"
import type {EthLikeContractData} from "../../../src/business/networks/EthLikeContractData"

export class TestContractDataProvider implements IContractDataProvider {
    public getNewTokenContractData<T>(): T | null {
        const {abi, bytecode} = erc20
        const ethContract = {
            contractInterface: abi,
            bytecode
        } as EthLikeContractData
        return ethContract as any
    }

    public static get instance(): TestContractDataProvider {
        return new TestContractDataProvider()
    }
}
