import {defineStore} from "pinia"
import type {Pool} from "@imversed/js-client/lib/pools/types/pools/v1beta1/pool"
import type {ServiceLocator} from "../business/ServiceLocator"

export const definePoolsStore = defineStore("pools", {
    state: (): IPollStore =>
        ({
            pools: [] as Pool[],
        } as IPollStore),
    getters: {
        getAllPools(): Pool[] {
            return this.pools
        }
    },
    actions: {
        async initialize(): Promise<void> {
            const factory = this.sl?.getFactory()
            this.pools = await factory?.getPoolsClient().getAllPools() || []
        }
    },
})

interface IPollStore {
    pools: Pool[],
    sl?: ServiceLocator
    initialize: () => Promise<void>
}