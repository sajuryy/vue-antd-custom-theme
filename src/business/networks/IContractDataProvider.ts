export interface IContractDataProvider {
    getNewTokenContractData<T>(): T | null
}
