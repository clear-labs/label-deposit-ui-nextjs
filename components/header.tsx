'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'

export default function Header() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="p-4 fixed top-0 left-0 w-full backdrop-blur-sm z-50">
      <nav className="flex justify-between items-center">
        <div className="flex justify-start items-center space-x-8">
          Restaker
        </div>
        {isMounted && (
          <WalletMultiButton
            style={{ backgroundColor: '#ccc', color: 'white' }}
          />
        )}
      </nav>
    </header>
  )
}
