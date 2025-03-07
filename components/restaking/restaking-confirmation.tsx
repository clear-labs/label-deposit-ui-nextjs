'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { ClearLabel } from '@/types/clear-label'
import { LabelIcon } from '../label-icon'
import { useMemo } from 'react'

interface RestakingConfirmationProps {
  label?: ClearLabel
  amount: number
  status: 'idle' | 'restaking' | 'success' | 'error'
  error?: string
  expectedBitAmount?: string
  onClose: () => void
}

export function RestakingConfirmation({
  label,
  amount,
  status,
  error,
  expectedBitAmount = "0",
  onClose
}: RestakingConfirmationProps) {

  const isOpen = useMemo(() => status && status !== 'idle', [status])
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="flex items-center gap-4">
          <LabelIcon
            symbol={label?.tokenSymbol}
            image={label?.metadata.image}
            name={label?.metadata.name}
            size="xl"
          />
          <DialogTitle>
            {status === 'restaking' && 'Confirm Transaction'}
            {status === 'success' && 'You are now restaking'}
            {status === 'error' && 'Restake has failed'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-4">
          <div className="text-center">
            <p className="text-6xl font-bold mb-4 relative my-4">{amount} <span className='text-muted-foreground absolute -top-4 text-sm'>SOL</span></p>

            {status === 'error' && (
              <p className="text-destructive">{error}</p>
            )}

            <div className="flex gap-2 justify-between text-left ">
              <div className="mt-4 ">
                <p className="text-muted-foreground text-xs">You receive</p>
                <p className="font-bold">
                  {Number(expectedBitAmount) > 0 &&
                    (<span>
                      {(Number(expectedBitAmount) / 1e9).toFixed(4)} {label?.tokenSymbol}
                    </span>
                    )
                  }
                </p>
              </div>
              <div className="mt-4 ">
                <p className="text-muted-foreground text-xs">APY</p>
                <p className="font-bold">
                  <span>{label?.yieldPercentage}%</span>
                </p>
              </div>

            </div>


          </div>

          {status !== 'restaking' && (
            <Button
              className="w-full"
              onClick={onClose}
            >
              {status === 'success' ? 'Close' : 'Try again'}
            </Button>
          )}

          {status === 'restaking' && (
            <Button
              className="w-full"
              variant="outline"
              size="lg"
              onClick={onClose}
            >
              <div className="flex text-lg gap-2">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Proceed in your wallet...
                </p>
              </div>
            </Button>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
} 