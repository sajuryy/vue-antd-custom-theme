import {defineStore} from "pinia"
import type {INetworksConfig} from "../business/INetworksConfig";

export const defineNetworkStore = defineStore("network", {
    state: () =>
        ({
            network: {}
        } as INetworkState),
    persist: true,
    getters: {
        getNetwork(): INetworksConfig{
            return this.network
        }
    },
    actions: {
        setNetwork(network: INetworksConfig) {
            this.network = network
        },
    },
})

interface INetworkState{
    network: INetworksConfig
}
