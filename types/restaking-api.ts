import { PublicKey } from '@solana/web3.js'

interface AccountMeta {
  pubkey: string
  isSigner: boolean
  isWritable: boolean
}

interface Instruction {
  programId: string
  accounts: AccountMeta[]
  data: string
}

interface BinQuote {
  address: string
  bitMint: string
  tokenSymbol: string
  currentBvl: string
  bitRate: string
  activated: boolean
  canActivate: boolean
  depth: number
}

interface Quote {
  lamports: string
  expectedBitAmount: string
  bin: BinQuote
}

export interface RestakingApiResponse {
  instructions: Instruction[]
  addressLookupTableAddresses: string[]
  serializedTransaction: string
  quote: Quote
}

export interface RestakingApiRequest {
  userPublicKey: string
  binAddress: string
  lamports: string
} 