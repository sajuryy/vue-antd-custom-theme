import type {NetworkName} from "../business/INetworksConfig";

export interface IBackendToken{
     name: string
     verseId: string
     contractAddress: string
     iconUrl: string
     decimals: number
     symbol: string
     network: NetworkName
     created: Date
}

