export const erc20 = {
  abi: [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "pname",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "psymbol",
                    "type": "string"
                },
                {
                    "internalType": "uint8",
                    "name": "pdecimals",
                    "type": "uint8"
                },
                {
                    "internalType": "uint256",
                    "name": "ptotalSupply",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "numTokens",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "delegate",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "numTokens",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "delegate",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "numTokens",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
  bytecode: "0x60806040523480156200001157600080fd5b5060405162000a9738038062000a9783398101604081905262000034916200021f565b83516200004990600090602087019062000093565b5082516200005f90600190602086019062000093565b506002805460ff191660ff939093169290921790915560058190553360009081526003602052604090205550620002ff9050565b828054620000a190620002aa565b90600052602060002090601f016020900481019282620000c5576000855562000110565b82601f10620000e057805160ff191683800117855562000110565b8280016001018555821562000110579182015b8281111562000110578251825591602001919060010190620000f3565b506200011e92915062000122565b5090565b5b808211156200011e576000815560010162000123565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f8301126200017a57600080fd5b81516001604060020a038082111562000197576200019762000139565b604051601f8301601f19908116603f01168101908282118183101715620001c257620001c262000139565b81604052838152602092508683858801011115620001df57600080fd5b600091505b83821015620002035785820183015181830184015290820190620001e4565b83821115620002155760008385830101525b9695505050505050565b600080600080608085870312156200023657600080fd5b84516001604060020a03808211156200024e57600080fd5b6200025c8883890162000168565b955060208701519150808211156200027357600080fd5b50620002828782880162000168565b935050604085015160ff811681146200029a57600080fd5b6060959095015193969295505050565b600281046001821680620002bf57607f821691505b602082108103620002f9577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b610788806200030f6000396000f3fe608060405234801561001057600080fd5b50600436106100c0576000357c010000000000000000000000000000000000000000000000000000000090048063313ce5671161009357806395d89b411161007857806395d89b4114610180578063a9059cbb14610188578063dd62ed3e1461019b57600080fd5b8063313ce5671461012b57806370a082311461014a57600080fd5b806306fdde03146100c5578063095ea7b3146100e357806318160ddd1461010657806323b872dd14610118575b600080fd5b6100cd6101e1565b6040516100da9190610568565b60405180910390f35b6100f66100f13660046105e6565b61026f565b60405190151581526020016100da565b6005545b6040519081526020016100da565b6100f6610126366004610610565b6102e8565b6002546101389060ff1681565b60405160ff90911681526020016100da565b61010a61015836600461064c565b73ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b6100cd61048c565b6100f66101963660046105e6565b610499565b61010a6101a936600461066e565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260046020908152604080832093909416825291909152205490565b600080546101ee906106a1565b80601f016020809104026020016040519081016040528092919081815260200182805461021a906106a1565b80156102675780601f1061023c57610100808354040283529160200191610267565b820191906000526020600020905b81548152906001019060200180831161024a57829003601f168201915b505050505081565b33600081815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102d79086815260200190565b60405180910390a350600192915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526003602052604081205482111561031a57600080fd5b73ffffffffffffffffffffffffffffffffffffffff8416600090815260046020908152604080832033845290915290205482111561035757600080fd5b73ffffffffffffffffffffffffffffffffffffffff8416600090815260036020526040902054610388908390610723565b73ffffffffffffffffffffffffffffffffffffffff851660009081526003602090815260408083209390935560048152828220338352905220546103cd908390610723565b73ffffffffffffffffffffffffffffffffffffffff808616600090815260046020908152604080832033845282528083209490945591861681526003909152205461041990839061073a565b73ffffffffffffffffffffffffffffffffffffffff80851660008181526003602052604090819020939093559151908616907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9061047a9086815260200190565b60405180910390a35060019392505050565b600180546101ee906106a1565b336000908152600360205260408120548211156104b557600080fd5b336000908152600360205260409020546104d0908390610723565b336000908152600360205260408082209290925573ffffffffffffffffffffffffffffffffffffffff85168152205461050a90839061073a565b73ffffffffffffffffffffffffffffffffffffffff84166000818152600360205260409081902092909255905133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906102d79086815260200190565b600060208083528351808285015260005b8181101561059557858101830151858201604001528201610579565b818111156105a7576000604083870101525b50601f01601f1916929092016040019392505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146105e157600080fd5b919050565b600080604083850312156105f957600080fd5b610602836105bd565b946020939093013593505050565b60008060006060848603121561062557600080fd5b61062e846105bd565b925061063c602085016105bd565b9150604084013590509250925092565b60006020828403121561065e57600080fd5b610667826105bd565b9392505050565b6000806040838503121561068157600080fd5b61068a836105bd565b9150610698602084016105bd565b90509250929050565b6002810460018216806106b557607f821691505b6020821081036106ee577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082821015610735576107356106f4565b500390565b6000821982111561074d5761074d6106f4565b50019056fea26469706673582212206924ca6aea5e9b7eab73348c0d865611af5955d5eab12a2b57c4900ac110017664736f6c634300080d0033"
}
