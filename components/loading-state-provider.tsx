"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface LoadingContextType {
  isLoading: boolean
  startLoading: (message?: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
})

export function useLoading() {
  return useContext(LoadingContext)
}

interface LoadingStateProviderProps {
  children: ReactNode
}

export function LoadingStateProvider({ children }: LoadingStateProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined)

  const startLoading = (message?: string) => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setLoadingMessage(undefined)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingSpinner fullScreen text={loadingMessage} />}
      {children}
    </LoadingContext.Provider>
  )
}
