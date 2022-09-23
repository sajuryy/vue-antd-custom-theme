import type {INetworksConfig} from "../INetworksConfig"
import axios from "axios"
import type {Signer} from "@ethersproject/abstract-signer"
import type {ITransactionSignerProvider} from "./ITransactionSignerProvider"
import type {IVerse} from "../../models/IVerse"
import type {NetworkName} from "../INetworksConfig";
import type {IBackendToken} from "../../models/IBackendToken";

export interface IBackendClient {
    getVerses(networkType: string, ownerAccountAddress: string): Promise<IVerse[]>

    createVerse(verseData: IVerse): Promise<string>

    postTokenCreated(tokenData: IPostTokenCreatedData): Promise<void>

    getTokens(verseId: string): Promise<IBackendToken[]>
}

export class BackendClient implements IBackendClient {
    private httpClient: any

    constructor(private readonly config: INetworksConfig, private readonly signerProvider: ITransactionSignerProvider) {
        this.httpClient = axios.create({
            baseURL: this.config.backendAddress
        })
    }

    public async getTokens(verseId: string): Promise<IBackendToken[]> {
        const url = `/erc20/${verseId}`
        const response = await this.httpClient.get(url)
        return response.data as IBackendToken[]
    }

    public async postTokenCreated(tokenData: IPostTokenCreatedData): Promise<void> {
        const signer = await this.signerProvider.getSigner<Signer>()
        const sign = await signer?.signMessage(tokenData.ownerAccountAddress) || ""

        const headers = {"Sign": sign};

        try {
            await this.httpClient.post("/erc20", tokenData, {headers})
        } catch (e) {
            throw e
        }
    }

    public async getVerses(networkType: string, ownerAccountAddress: string): Promise<IVerse[]> {
        const url = `/verse?network=${networkType}&ownerAccountAddress=${ownerAccountAddress}`
        const response = await this.httpClient.get(url)
        return response.data as IVerse[]
    }

    public async createVerse(verseData: ICreateVerseData): Promise<string> {
        const body = {
            ownerAccountAddress: verseData.ownerAccountAddress,
            name: verseData.name,
            iconUrl: verseData.iconUrl,
            network: verseData.network
        }
        const signer = await this.signerProvider.getSigner<Signer>()
        const sign = await signer?.signMessage(body.ownerAccountAddress) || ""

        const headers = {"Sign": sign};

        try {
           const {data} = await this.httpClient.post("/verse", body, {headers})
            return data._id
        } catch (e) {
            throw e
        }
    }
}

export interface ICreateVerseData {
    ownerAccountAddress: string
    name: string
    iconUrl: string
    network: string
}

export interface IPostTokenCreatedData {
    name: string
    verseId: string
    contractAddress: string
    iconUrl: string
    ownerAccountAddress: string
    decimals: number
    symbol: string
    network: NetworkName
}
