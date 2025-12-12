import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [loadingStates, setLoadingStates] = useState({})

  const setLoading = (key, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }))
  }

  const isLoading = (key) => {
    return loadingStates[key] || false
  }

  const isAnyLoading = () => {
    return Object.values(loadingStates).some((loading) => loading === true)
  }

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading, isAnyLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

