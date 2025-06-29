import React, { useContext, useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { sepolia, polygon } from 'wagmi/chains'

interface User {
  address: string
  isConnected: boolean
  chainId: number
  chainName: string
}

interface AuthContextProps {
  user: User | null
  isLoading: boolean
  error: string | null
  connect: (connectorId: string) => void
  disconnect: () => void
  switchNetwork: (chainId: 11155111 | 137) => void
  isSupportedNetwork: boolean
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Check if current network is supported
  const isSupportedNetwork = chainId === sepolia.id || chainId === polygon.id

  // Update user state when wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      const chainName = chainId === sepolia.id ? 'Sepolia' : 
                       chainId === polygon.id ? 'Polygon' : 
                       'Unknown'
      setUser({
        address,
        isConnected,
        chainId: chainId,
        chainName
      })
      setError(null)
    } else {
      setUser(null)
    }
  }, [isConnected, address, chainId])

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setError(connectError.message)
    }
  }, [connectError])

  const handleConnect = (connectorId: string) => {
    setIsLoading(true)
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
    }
    setIsLoading(false)
  }

  const handleDisconnect = () => {
    disconnect()
    setUser(null)
    setError(null)
  }

  const handleSwitchNetwork = (chainId: 11155111 | 137) => {
    if (switchChain) {
      switchChain({ chainId })
    }
  }

  const contextValue: AuthContextProps = {
    user,
    isLoading,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
    isSupportedNetwork
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if(!context){
    throw new Error("useAuth must be used within its provider...")
  }

  return context;
}