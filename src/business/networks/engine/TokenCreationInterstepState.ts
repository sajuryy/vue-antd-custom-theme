import type {IDeployedContract} from "../IDeployedContract"
import type {IOperationFlowState} from "./IOperationFlowState"

export class TokenCreationInterstepState implements IOperationFlowState {
    deployedContract: IDeployedContract | null = null

    deserialize(content: string): void {
        throw "Not implemented"
    }

    serialize(): string {
        throw "Not implemented"
    }
}
