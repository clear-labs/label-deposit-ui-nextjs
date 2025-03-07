'use client'

import type { ClearLabel } from '@/types/clear-label'
import { LabelIcon } from '../label-icon'

interface RestakingHeaderProps {
  label?: ClearLabel
  isLoading?: boolean
}

export function RestakingHeader({ label, isLoading }: RestakingHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        {label && (
          <LabelIcon
            symbol={label.tokenSymbol}
            image={label.metadata.image}
            name={label.metadata.name}
            size="lg"
          />
        )}
        <h1 className="text-2xl font-semibold">
          {isLoading ? 'Loading...' : label ? `Restake ${label.tokenSymbol}` : 'Restake'}
        </h1>
      </div>
    </div>
  )
} 