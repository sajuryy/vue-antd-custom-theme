export interface IOperationFlowState {
    serialize(): string
    deserialize(content: string): void
}
