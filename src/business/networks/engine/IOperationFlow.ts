import type {IOperationStep} from "./IOperationStep"
import type {IOperationFlowState} from "./IOperationFlowState"

export interface IOperationFlow<TResult> {
    readonly operationSteps: IOperationStep[]

    retrieveOperationFlowState(): IOperationFlowState

    retrieveResult(): TResult
}

export class GeneralOperationsFlow<TResult> implements IOperationFlow<TResult> {
    public readonly operationSteps: IOperationStep[]

    public constructor(public readonly steps: IOperationStep[],
                       private readonly flowState: IOperationFlowState,
                       private readonly getResultFromState: () => TResult) {
        this.operationSteps = steps
    }

    public retrieveOperationFlowState(): IOperationFlowState {
        return this.flowState
    }

    public retrieveResult(): TResult {
        return this.getResultFromState()
    }
}
