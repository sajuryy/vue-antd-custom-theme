import type {Store, StoreDefinition} from "pinia"
import {defineStore} from "pinia"

const useStoreInitializer = defineStore("initializerStore", {
    state: () => ({
        initStates: {} as Record<string, boolean>,
        initializedTime: {} as Record<string, number>
    }),
    persist: true,
    getters: {
        isInitialized: (state) => (key: string) => state.initStates[key],
        getInitializedTime: (state) => (key: string) => state.initializedTime[key]
    },
    actions: {
        setInitialized(key: string) {
            this.initStates[key] = true
        },
        setInitializedTime(key: string) {
            this.initializedTime[key] = Date.now()
        }
    },
});

export function useInitializableStore<Id extends string, S extends IStoreState, G, A>(storeDefinition: StoreDefinition<Id, S, G, A>): () => Store<Id, S, G, A> {
    return () => {
        const store = storeDefinition() as Store<Id, S, G, A>
        const storeInitializer = useStoreInitializer()
        const storeId = store.$id
        if (!storeInitializer.isInitialized(storeId)) {
            const initFunction = store["initialize"]
            if (typeof initFunction === "function") {
                initFunction()
                storeInitializer.setInitializedTime(storeId)
                storeInitializer.setInitialized(storeId)
            }
        }
        if (Date.now() - storeInitializer.getInitializedTime(storeId) > 5000) {
            store["initialize"]()
            storeInitializer.setInitializedTime(storeId)
        }
        return store
    }
}

interface IStoreState {
    initialize: () => Promise<void>
}