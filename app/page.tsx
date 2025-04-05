import { Providers } from "@/components/providers"
import { RestakingContainer } from '@/components/restaking/restaking-container'
import { RestakingDetails } from "@/components/restaking/restaking-details"
import { RestakingHeader } from "@/components/restaking/restaking-header"
import type { ClearLabel } from "@/types/clear-label"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

// Server-side data fetching
async function getLabelData(): Promise<ClearLabel | undefined> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_CLEAR_API_URL || 'https://clearsol.network/api'
    const labelAddress = process.env.NEXT_PUBLIC_BIN_PDA
    const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet'

    if (!apiUrl || !labelAddress) {
      return
    }

    const res = await fetch(`${apiUrl}/label/${network}/${labelAddress}`, {
      next: { revalidate: 600 } // Cache for 1 hour
    })
    console.log(res)

    if (!res.ok) return
    return await res.json()
  } catch (error) {
    console.error("Failed to fetch label data:", error)
    return
  }
}

export default async function RestakingPage() {
  // Fetch data server-side
  const label = await getLabelData()

  return (
    <Suspense fallback={<div className="min-h-screen min-w-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
      <Providers>
        <div className="min-h-screen max-w-2xl mx-auto p-4 space-y-4">
          <RestakingHeader label={label} isLoading={false} />
          <RestakingContainer label={label} />
          <RestakingDetails label={label} />
        </div>
      </Providers>
    </Suspense>
  )
}

