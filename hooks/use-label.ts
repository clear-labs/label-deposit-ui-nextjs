'use client'

import { ClearLabel } from '@/types/clear-label'
import useSWR from 'swr'


const fetcher = (url: string) => fetch(url).then(res => res.json())

/**
 * Client-side data fetching for dynamic updates
 * Use this when you need to refresh data after user interactions
 * @param initialData Optional data from server-side to avoid loading flash
 */
export function useLabel(initialData?: ClearLabel) {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'
  const labelAddress = process.env.NEXT_PUBLIC_LABEL_ADDRESS
  const apiUrl = process.env.NEXT_PUBLIC_CLEAR_API_URL

  const { data, error, isLoading } = useSWR<ClearLabel>(
    labelAddress && apiUrl ? `${apiUrl}/label/${network}/${labelAddress}` : null,
    fetcher,
    { 
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnMount: !initialData
    }
  )

  return {
    label: data,
    isLoading,
    isError: error
  }
} 