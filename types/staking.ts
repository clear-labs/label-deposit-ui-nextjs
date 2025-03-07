export interface StakingStrategy {
  id: string
  name: string
  description: string
  apy: number
  icon: string
  features: string[]
}

export interface StakingState {
  amount: number
  strategy: StakingStrategy | null
  status: 'idle' | 'staking' | 'success' | 'error'
  error?: string
}


