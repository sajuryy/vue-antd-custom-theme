export interface ITransactionSignerProvider {
    getSigner<T>(): Promise<T | null>
}

