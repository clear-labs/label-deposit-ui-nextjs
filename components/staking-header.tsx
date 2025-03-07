'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ClearLabel } from '@/types/clear-label'
import { LabelIcon } from './label-icon'

interface StakingHeaderProps {
  label?: ClearLabel
  isLoading?: boolean
}

export function StakingHeader({ label, isLoading }: StakingHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Link href="#" className="text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <div className="flex items-center gap-2">
        {label && (
          <LabelIcon
            symbol={label.tokenSymbol}
            image={label.metadata.image}
            name={label.metadata.name}
            size="sm"
          />
        )}
        <h1 className="text-2xl font-semibold">
          {isLoading ? 'Loading...' : label ? `Stake ${label.tokenSymbol}` : 'Stake'}
        </h1>
      </div>
    </div>
  )
}

