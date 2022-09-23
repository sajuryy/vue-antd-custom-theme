import {defineStore} from "pinia"
import type {V1Beta1Metadata} from "@imversed/js-client/lib/bank/rest"
import type {ServiceLocator} from "../business/ServiceLocator"

export const defineMetaDataStore = defineStore("metaData", {
    state: (): IMetadataStore  =>
        ({
            metaData: [] as V1Beta1Metadata[],
            contractNames: {} as IContractNames
        } as IMetadataStore),
    persist: true,
    getters: {
        getAllMetaData(): V1Beta1Metadata[] {
            return this.metaData
        },
        getContractNames(): IContractNames {
            return this.contractNames
        }
    },
    actions: {
       async initialize(): Promise<void>{
            this.metaData = await this.sl?.getFactory().getBankClient().getAllMetaData() || []
            this.contractNames = this.metaData.reduce((acc:IContractNames, cur: V1Beta1Metadata) => {
                const regexpErc20 = new RegExp("erc20/")
                const regexpPool = new RegExp("pools")
                if(regexpPool.test(cur.base!)){
                    return acc
                }
                const base = (regexpErc20.test(cur.base!) ? cur.base?.replace(regexpErc20,""): cur.base) as string
                acc[base.toLowerCase()] = {
                    name: `${cur.display}`,
                    symbol: `${cur.symbol}`
                }
                return acc
            },{} as IContractNames)
       }
    }
})

export interface IMetadataStore {
    sl?: ServiceLocator
    metaData: V1Beta1Metadata[]
    contractNames: IContractNames
    initialize: () => Promise<void>
}

export interface IContractNames {
    [key: string]: {
        name: string,
        symbol: string
    }
}