import axios, {type AxiosInstance} from "axios"
import type {IEthToken, ITokenInfo} from "../../../models/EthToken"
import type {ITokenDataReader} from "./tokens/ITokenDataReader"

export class ImversedEthDataReader implements ITokenDataReader {
  private readonly httpClient: AxiosInstance

  public constructor(explorerAddress: string) {
    this.httpClient = axios.create({baseURL: explorerAddress})
  }

  public async getTokenListByAddress(address: string): Promise<IEthToken[]> {
    const {data} = await this.httpClient.get(`api?module=account&action=tokenlist&address=${address}`)
    return data.result as IEthToken[] || []
  }

  public async getTokenBalanceByAddress(addressHash: string, contractAddressHash: string): Promise<string> {
    const {data} = await this.httpClient.get(`api?module=account&action=tokenbalance&contractaddress=${contractAddressHash}&address=${addressHash}`)
    return data.result as string
  }

  public async getTokenInfoByContractAddress(contractAddressHash: string): Promise<ITokenInfo | null> {
    const {data} = await this.httpClient.get(`api?module=token&action=getToken&contractaddress=${contractAddressHash}`)
    if (data.status === 1){
      return data.result
    }
    return null
  }
}
