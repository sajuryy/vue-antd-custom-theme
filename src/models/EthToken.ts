export interface IEthToken {
  balance: number
  contractAddress: string
  decimals: number
  name: string
  symbol: string
  type: ITokenType
}

export enum ITokenType {
  ERC20 = "ERC-20",
  ERC721 = "ERC-721",
}

export interface INewTokenData {
  name: string
  symbol: string
  decimals: number
  supply: string
}

export interface ITokenInfo {
  cataloged: boolean
  contractAddress: string,
  decimals: number
  name: string
  symbol: string
  totalSupply: number
  type: ITokenType
}
