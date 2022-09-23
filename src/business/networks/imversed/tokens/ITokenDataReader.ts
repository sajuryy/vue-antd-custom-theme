import type {IEthToken, ITokenInfo} from "../../../../models/EthToken"

export interface ITokenDataReader {
    getTokenInfoByContractAddress(address: string): Promise<ITokenInfo | null>
    getTokenListByAddress(address: string): Promise<IEthToken[]>
    getTokenBalanceByAddress(addressHash: string, contractAddressHash: string): Promise<string>
}
