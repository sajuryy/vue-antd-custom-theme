import type {ContractInterface} from "@ethersproject/contracts/src.ts"
import type {BytesLike} from "@ethersproject/bytes"

export interface EthLikeContractData {
    contractInterface: ContractInterface
    bytecode: BytesLike
}
