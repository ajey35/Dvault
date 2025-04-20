"use client"

import type React from "react"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"

interface WalletCheckProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

export function WalletCheck({ children, fallback }: WalletCheckProps) {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    try {
      setMounted(true)
    } catch (err) {
      console.error("Error in WalletCheck:", err)
      setHasError(true)
    }
  }, [])

  // Handle loading state
  if (!mounted) return null

  // Handle error state
  if (hasError) return <>{fallback}</>

  return isConnected ? <>{children}</> : <>{fallback}</>
}
