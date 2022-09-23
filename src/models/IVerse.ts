import type {NetworkName} from "../business/INetworksConfig";

export interface IVerse {
    _id: string
    name: string
    ownerAccountAddress: string
    iconUrl: string
    network: NetworkName
    created: Date
}
