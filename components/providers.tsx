'use client'

import { useEffect, useState } from 'react'
import WalletProvider from "./app-wallet-provider"
import Header from "./header"
import { Loader2 } from "lucide-react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {!mounted ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <WalletProvider>
          <Header />
          <main className="mt-20">
            {children}
          </main>
        </WalletProvider>
      )}
    </>
  )
} 