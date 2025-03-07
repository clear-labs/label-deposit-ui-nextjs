'use client'

import { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection, LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js'
import { toast } from 'sonner'
import type { ClearLabel } from '@/types/clear-label'
import type { RestakingApiResponse } from '@/types/restaking-api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RestakingConfirmation } from './restaking-confirmation'

interface RestakingContainerProps {
  label?: ClearLabel
}

type RestakingStatus = 'idle' | 'restaking' | 'success' | 'error'

const CLEAR_API_URL = process.env.NEXT_PUBLIC_CLEAR_API_URL

export function RestakingContainer({ label }: RestakingContainerProps) {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState<RestakingStatus>('idle')
  const [error, setError] = useState<string>()
  const [expectedBitAmount, setExpectedBitAmount] = useState<string>()
  const [isMounted, setIsMounted] = useState(false)


  const getBal = async () => {
    if (!publicKey) return
    let _balance = await SOLANA_CONNECTION.getBalance(publicKey!)
    setBal(_balance / LAMPORTS_PER_SOL)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])
  useEffect(() => {
    if (!isMounted) return
    getBal()
  }, [publicKey])

  const SOLANA_CONNECTION = new Connection(process.env.NEXT_PUBLIC_RPC_URL!)
  const [balance, setBal] = useState<any>()

  const handleRestake = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !label || !signTransaction || !CLEAR_API_URL) {
      toast.error('Missing configuration or wallet not connected')
      return
    }

    setStatus('restaking')
    try {

      const lamports = amount * LAMPORTS_PER_SOL
      const res = await fetch(`${CLEAR_API_URL}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPublicKey: publicKey.toString(),
          binAddress: label.publicKey,
          lamports: lamports.toString(),
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${res.status}`)
      }

      const data: RestakingApiResponse = await res.json()

      setExpectedBitAmount(data.quote.expectedBitAmount)

      if (!data.serializedTransaction) {
        throw new Error('Invalid API response: missing transaction data')
      }

      const txBuffer = new Uint8Array(Buffer.from(data.serializedTransaction, 'base64'))
      const transaction = VersionedTransaction.deserialize(txBuffer)
      const signedTx = await signTransaction(transaction)

      const simulation = await connection.simulateTransaction(signedTx)
      if (simulation.value.err) {
        throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`)
      }

      const latestBlockHash = await connection.getLatestBlockhash()
      const txid = await connection.sendRawTransaction(signedTx.serialize())

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      })


      setStatus('success')
      toast.success('Restake successful', {
        description: `Transaction: ${txid}`
      })
    } catch (err) {
      console.error('Restake failed:', err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Transaction failed')
      toast.error('Failed to restake', {
        description: err instanceof Error ? err.message : undefined
      })
    }
  }

  const resetFlow = () => {
    setAmount(0)
    setStatus('idle')
    setError(undefined)
    setExpectedBitAmount(undefined)
  }

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
        <p className="text-muted-foreground">Connect your wallet to continue</p>
        <WalletMultiButton className="mx-auto" />
      </div>
    )
  }

  return (

    <Card>
      <CardContent>
        <form onSubmit={handleRestake} className="space-y-6">

          <div className="flex items-center gap-3 mt-6">
            <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              alt="SOL"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-lg">Solana</h2>
              {balance && <p className="text-sm text-muted-foreground">Balance: {balance.toFixed(4)} SOL</p>}
            </div>
          </div>
          <div className="gap-2">
            <div className="relative flex items-center justify-end">
              <Input
                type="text"
                autoComplete="off"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="text-4xl h-20 font-bold"
                placeholder="0.0"
              />
              <span className="ml-2 right-3 text-2xl text-muted-foreground">
                SOL
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-16 text-[10px] ml-auto block mt-2"
              onClick={() => setAmount(balance)}
            >
              MAX
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!amount || amount <= 0 || status === 'restaking'}
          >
            {status === 'restaking' ? 'Restaking...' : 'Restake'}
          </Button>

        </form>

        <RestakingConfirmation
          label={label}
          amount={amount}
          status={status}
          error={error}
          expectedBitAmount={expectedBitAmount}
          onClose={resetFlow}
        />

      </CardContent>
    </Card>

  )
} 