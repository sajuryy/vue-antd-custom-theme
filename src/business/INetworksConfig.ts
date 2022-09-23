export enum NetworkName {
    IMVERSED_CANARY = "imversed",
    IMVERSED_TESTNET = "imversed-testnet",
    ETH_MAIN = "ethereum",
    GOERLI = "goerli"
}

export interface INetworksConfig {
    id: string
    name: NetworkName
    uiName: string
    icon: string
    options: string[]
    cosmosTxAddress: string
    cosmosQAddress: string
    ethAddress: string
    ethExplorerAddress: string
    backendAddress: string
}

