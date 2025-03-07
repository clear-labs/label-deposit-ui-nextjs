'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { LabelIcon } from '../label-icon'
import type { ClearLabel } from '@/types/clear-label'

interface RestakingDetailsProps {
  label?: ClearLabel
}

export function RestakingDetails({ label }: RestakingDetailsProps) {
  if (!label) return null

  return (
    <div className="space-y-4">
      <Card className="bg-foreground/10 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LabelIcon
                symbol={label.tokenSymbol}
                image={label.metadata.image}
                name={label.metadata.name}
                size="sm"
              />
              <div>
                <h3 className="font-medium">{label.metadata.name}</h3>
              </div>
            </div>
            <Badge variant="secondary" className="font-medium">
              {label.yieldPercentage}% APY
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Label Features:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                Automated restaking delegation
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                Protected restaking rewards
              </li>
            </ul>
          </div>

        </CardContent>
      </Card>


    </div>
  )
} 