export interface IOperationStep {
    readonly id: string

    retryCounter(): number

    run(): Promise<unknown>
}

export class GeneralOperationStep<TState> implements IOperationStep {
    private retryCount = 0

    public constructor(public readonly id: string,
                       private readonly closure: (x: TState) => Promise<unknown>,
                       private readonly interstepStorage: TState) {
    }

    public retryCounter(): number {
        return this.retryCount
    }

    public async run(): Promise<unknown> {
        this.retryCount += 1
        return this.closure(this.interstepStorage)
    }
}
