export interface INetworkDataReaderProvider {
    getDataReader<T>(network: string): Promise<T | null>
}
