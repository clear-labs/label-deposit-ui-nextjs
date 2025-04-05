'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js'
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

const CLEAR_API_URL = process.env.NEXT_PUBLIC_CLEAR_API_URL || 'https://clearsol.network/api'

export function RestakingContainer({ label }: RestakingContainerProps) {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [amountString, setAmountString] = useState('')
  const [status, setStatus] = useState<RestakingStatus>('idle')
  const [error, setError] = useState<string>()
  const [expectedBitAmount, setExpectedBitAmount] = useState<string>()
  const [balance, setBalance] = useState<number>()
  const [isMounted, setIsMounted] = useState(false)

  const amount = parseFloat(amountString) || 0

  const getBal = useCallback(async () => {
    if (!publicKey || !connection) return
    try {
      const _balance = await connection.getBalance(publicKey)
      setBalance(_balance / LAMPORTS_PER_SOL)
    } catch (err) {
      console.error("Failed to fetch balance:", err)
    }
  }, [publicKey, connection])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    getBal()
  }, [isMounted, getBal])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '.') {
      setAmountString('0.')
      return
    }

    if (value === '' || /^\d*\.?\d{0,9}$/.test(value)) {
      setAmountString(value)

      if (e.target.matches(':focus') === false) {
        normalizeAmount(value)
      }
    }
  }

  const normalizeAmount = (value: string) => {
    if (value === '') return

    const num = parseFloat(value)
    if (!isNaN(num)) {
      if (value.includes('.')) {
        const [whole, decimal] = value.split('.')
        setAmountString(`${parseInt(whole, 10)}.${decimal}`)
      } else {
        setAmountString(`${parseInt(value, 10)}`)
      }
    }
  }

  const handleBlur = () => {
    normalizeAmount(amountString)
  }

  const handleRestake = async (e: React.FormEvent) => {
    e.preventDefault()

    // Log values to help debug
    console.log({
      publicKey: publicKey?.toString(),
      label,
      signTransaction: !!signTransaction,
      connection: !!connection,
      CLEAR_API_URL
    })

    // Check each condition separately to provide more specific error messages
    if (!publicKey) {
      toast.error('Wallet not connected')
      return
    }

    if (!label) {
      toast.error('Label configuration missing')
      return
    }

    if (!signTransaction) {
      toast.error('Wallet does not support signing')
      return
    }

    if (!CLEAR_API_URL) {
      toast.error('API URL not configured')
      return
    }

    if (!connection) {
      toast.error('Connection not established')
      return
    }

    if (amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setStatus('restaking')

    try {
      const lamports = amount * LAMPORTS_PER_SOL
      console.log('restaking!')
      console.log(label)
      console.table({
        publicKey: publicKey?.toString(),
        binAddress: label.binAddress.toString(),
        amount: amount,
        lamports: lamports.toString(),
      })
      const res = await fetch(`${CLEAR_API_URL}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPublicKey: publicKey.toString(),
          binAddress: label.binAddress.toString(), // Ensure this is a string
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

      getBal()
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
    setAmountString('')
    setStatus('idle')
    setError(undefined)
    setExpectedBitAmount(undefined)
  }

  const handleSetMaxAmount = () => {
    if (balance) {
      const maxAmount = Math.max(0, balance - 0.01)
      setAmountString(maxAmount.toFixed(9).replace(/\.?0+$/, ''))
    }
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
            <img
              src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              alt="SOL"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-lg">Solana</h2>
              {balance !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Balance: {balance.toFixed(4)} SOL
                </p>
              )}
            </div>
          </div>

          <div className="gap-2">
            <div className="relative flex items-center justify-end">
              <Input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amountString}
                onChange={handleAmountChange}
                onBlur={handleBlur}
                className="text-4xl h-20 font-bold"
                placeholder="0.0"
                aria-label="SOL amount to restake"
              />
              <span className="ml-2 right-3 text-2xl text-muted-foreground">
                SOL
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-16 text-[10px] ml-auto block mt-2"
              onClick={handleSetMaxAmount}
              disabled={!balance}
            >
              MAX
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={amount <= 0 || status === 'restaking' || !balance}
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