import type {CreateEthTokenData} from "./CreateEthTokenData"
import type {IOperationFlow} from "./engine/IOperationFlow"
import type {IDeployedContract} from "./IDeployedContract"
import type {ITokenInfo} from "../../models/EthToken";

export interface ITokensClient {
    createNewToken(data: CreateEthTokenData): Promise<IOperationFlow<IDeployedContract | null>>
    getListOfOwnTokens(): Promise<any>
    getOwnBalanceInContract(getContractAddress: string): Promise<string>
    getTokenInfoByContractAddress(contractAddress: string): Promise<ITokenInfo | null>
}
