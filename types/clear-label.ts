import type { PublicKey } from '@solana/web3.js'

type Epoch = string
type Lamports = string
type Base58 = string

interface LastEpochValues {
  value: Base58
  rateLamports: Base58
  epoch: Epoch
  lastBrewed: Base58
}

interface Staleness {
  isStale: boolean
  slotsSinceUpdate: number
  slotsUntilStale: number
  currentSlot: number
}

interface Metadata {
  name: string
  symbol: string
  description: string
  image: string
}

export interface ClearLabel {
  // config: PublicKey
  // nextBin: PublicKey | null
  // prevBin: PublicKey | null
  // depth: number
  // activated: boolean
  // canActivate: boolean
  // restakedMint: PublicKey | null
  // uniqIndex: number
  tokenSymbol: string
  mint: string | PublicKey
  // mintBump: number
  // lastClearedEpoch: Epoch
  // bump: number
  // bvl: Base58
  // lastBrewed: Base58
  // bitRateLamports: Base58
  // pendingRemovalLamports: Base58
  // removalRequestCount: Base58
  // lastRemovalResetEpoch: Epoch
  // lastEpochValues: LastEpochValues
  publicKey: string | PublicKey
  // restakedBalance: string
  // lstBalance: string
  // bitSupply: string
  // calculatedValue: number
  // staleness: Staleness
  yieldPercentage: number
  metadata: Metadata
} 