import type {ProviderType} from "@/models/ProviderType"

export interface IWalletState {
  address: string
  chainId: string
  type: ProviderType
  mnemonic: string
  cosmosAddress: string
}
