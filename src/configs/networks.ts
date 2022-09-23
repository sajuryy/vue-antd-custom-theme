import {NetworkName} from "../business/INetworksConfig";
import type {INetworksConfig} from "../business/INetworksConfig";

export const networks: INetworksConfig[] = [
    {
        name: NetworkName.IMVERSED_TESTNET,
        uiName: "Imversed Testnet",
        icon: "/images/icons/svg/networks/ic_imversed.svg",
        options: [
            "Convallis fermentum, hac aptent quis sodales Posuere arcu massa aenean Turpis tortor",
            "Egestas proin Consectetur aliquam adipiscing, odio amet posuere aenean",
            "Nam nunc, vehicula nulla mauris dapibus Maecenas magna primis Inceptos quisque, vestibulum dui ut Inceptos vitae Quisque turpis lobortis",
            "Platea accumsan torquent, hendrerit nostra id euismod Inceptos dictum feugiat, elementum etiam aliquam posuere Diam praesent"
        ],
        cosmosTxAddress: "https://tx-endpoint-test.imversed.com:443",
        cosmosQAddress: "https://query-endpoint-test.imversed.com:443",
        ethAddress: "https://jsonrpc-endpoint-test.imversed.com:443",
        ethExplorerAddress: "https://txe-test.imversed.com",
        backendAddress: "https://dashboard-api.imversed.com/",
        id: "5555558"
    },
    {
        name: NetworkName.IMVERSED_CANARY,
        uiName: "Imversed",
        icon: "/images/icons/svg/networks/ic_imversed.svg",
        options: [
            "Convallis fermentum, hac aptent quis sodales Posuere arcu massa aenean Turpis tortor",
            "Egestas proin Consectetur aliquam adipiscing, odio amet posuere aenean",
            "Nam nunc, vehicula nulla mauris dapibus Maecenas magna primis Inceptos quisque, vestibulum dui ut Inceptos vitae Quisque turpis lobortis",
            "Platea accumsan torquent, hendrerit nostra id euismod Inceptos dictum feugiat, elementum etiam aliquam posuere Diam praesent"
        ],
        cosmosTxAddress: "string",
        cosmosQAddress: "string",
        ethAddress: "string",
        ethExplorerAddress: "string",
        backendAddress: "string",
        id: "5555555"
    },
    // {
    //     name: "Ethereum",
    //     icon: "/images/icons/svg/networks/ic_ethereum.svg",
    //     options: [
    //         "Convallis fermentum, hac aptent quis sodales Posuere arcu massa aenean Turpis tortor",
    //         "Egestas proin Consectetur aliquam adipiscing, odio amet posuere aenean",
    //         "Nam nunc, vehicula nulla mauris dapibus Maecenas magna primis Inceptos quisque, vestibulum dui ut Inceptos vitae Quisque turpis lobortis",
    //         "Platea accumsan torquent, hendrerit nostra id euismod Inceptos dictum feugiat, elementum etiam aliquam posuere Diam praesent"
    //     ]
    // },
    // {
    //     name: "Goerli",
    //     icon: "/images/icons/svg/networks/ic_imversed.svg",
    //     options: [
    //         "Convallis fermentum, hac aptent quis sodales Posuere arcu massa aenean Turpis tortor",
    //         "Egestas proin Consectetur aliquam adipiscing, odio amet posuere aenean",
    //         "Nam nunc, vehicula nulla mauris dapibus Maecenas magna primis Inceptos quisque, vestibulum dui ut Inceptos vitae Quisque turpis lobortis",
    //         "Platea accumsan torquent, hendrerit nostra id euismod Inceptos dictum feugiat, elementum etiam aliquam posuere Diam praesent"
    //     ]
    // },
]


