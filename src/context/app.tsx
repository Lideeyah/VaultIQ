import React, { useContext, useState, useEffect } from "react"
import { useWriteContract, useAccount, useChainId } from 'wagmi'
import { VAULT_TOKEN_ABI, VAULT_FACTORY_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'
import axios from 'axios'

interface VaultToken {
  tokenId: number
  owner: string
  tokenURI: string
  verification: {
    status: string
    score: number
  }
}

interface AssetSubmission {
  fileUrl: string
  metadata: {
    name: string
    description: string
    type: string
    value: string
  }
  status: string
  score: number
  owner: string
}

interface AppContextProps {
  // Contract functions
  getVaultTokenInfo: (tokenId: number) => Promise<VaultToken | null>
  getTotalSupply: () => Promise<number>
  getOwnerVaults: (ownerAddress: string) => Promise<VaultToken[]>
  mintVault: (to: string, tokenURI: string) => Promise<any>
  requestVerification: (tokenId: number, fileUrl: string) => Promise<any>
  createVault: (assetOwner: string, verificationProof: string) => Promise<any>
  
  // Backend API functions
  submitAsset: (file: File, metadata: AssetSubmission['metadata'], owner: string) => Promise<any>
  createAsset: (assetData: Omit<AssetSubmission, 'fileUrl'>) => Promise<any>
  getAssets: () => Promise<any>
  
  // State
  isLoading: boolean
  error: string | null
  contractAddresses: any
}

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get contract addresses for current network
  const getContractAddresses = () => {
    if (!chainId) return CONTRACT_ADDRESSES.sepolia // Default to Sepolia
    return CONTRACT_ADDRESSES[chainId as unknown as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES.sepolia
  }
  
  const contractAddresses = getContractAddresses()
  
  // Contract read functions
  const getVaultTokenInfo = async (tokenId: number): Promise<VaultToken | null> => {
    // TODO: Implement with proper wagmi v1 readContract
    console.log('getVaultTokenInfo not implemented yet')
    return null
  }
  
  const getTotalSupply = async (): Promise<number> => {
    // TODO: Implement with proper wagmi v1 readContract
    console.log('getTotalSupply not implemented yet')
    return 0
  }
  
  const getOwnerVaults = async (ownerAddress: string): Promise<VaultToken[]> => {
    // TODO: Implement with proper wagmi v1 readContract
    console.log('getOwnerVaults not implemented yet')
    return []
  }
  
  // Contract write functions
  const mintVault = async (to: string, tokenURI: string) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const hash = await writeContractAsync({
        address: contractAddresses.vaultToken as `0x${string}`,
        abi: VAULT_TOKEN_ABI,
        functionName: 'mintVault',
        args: [to as `0x${string}`, tokenURI],
      })
      return hash
    } catch (error) {
      const errorMessage = error instanceof Error ? 'Transaction failed. Please try again.' : 'Transaction failed. Please try again.'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const requestVerification = async (tokenId: number, fileUrl: string) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const hash = await writeContractAsync({
        address: contractAddresses.vaultToken as `0x${string}`,
        abi: VAULT_TOKEN_ABI,
        functionName: 'requestVerification',
        args: [BigInt(tokenId), fileUrl],
      })
      return hash
    } catch (error) {
      const errorMessage = error instanceof Error ? 'Transaction failed. Please try again.' : 'Transaction failed. Please try again.'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const createVault = async (assetOwner: string, verificationProof: string) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const hash = await writeContractAsync({
        address: contractAddresses.vaultFactory as `0x${string}`,
        abi: VAULT_FACTORY_ABI,
        functionName: 'createVault',
        args: [assetOwner as `0x${string}`, verificationProof as `0x${string}`],
      })
      return hash
    } catch (error) {
      const errorMessage = error instanceof Error ? 'Transaction failed. Please try again.' : 'Transaction failed. Please try again.'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Backend API functions
  const API_BASE_URL = 'http://localhost:5000'
  
  const submitAsset = async (file: File, metadata: AssetSubmission['metadata'], owner: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('metadata', JSON.stringify(metadata))
      
      const response = await axios.post(`${API_BASE_URL}/api/assets/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (err) {
      const errorMessage = 'Failed to submit asset. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const createAsset = async (assetData: Omit<AssetSubmission, 'fileUrl'>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Check if backend is running
      try {
        await axios.get(`${API_BASE_URL}/`)
      } catch (healthCheckError) {
        console.warn('Backend health check failed:', healthCheckError);
        throw new Error('Backend server is not running. Please start the backend server first.');
      }
      
      // Stringify metadata since the backend database expects it as a string
      const backendData = {
        ...assetData,
        metadata: typeof assetData.metadata === 'string' ? assetData.metadata : JSON.stringify(assetData.metadata)
      };
      
      console.log('createAsset: Sending data to backend:', backendData);
      
      const response = await axios.post(`${API_BASE_URL}/assets`, backendData)
      console.log('createAsset: Backend response:', response.data);
      return response.data
    } catch (err) {
      console.error('createAsset: Error creating asset:', err);
      const errorMessage = err instanceof Error && err.message.includes('Backend server') 
        ? err.message 
        : 'Failed to create asset. Please try again.';
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getAssets = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${API_BASE_URL}/assets`)
      return response.data
    } catch (err) {
      const errorMessage = 'Failed to fetch assets. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue: AppContextProps = {
    getVaultTokenInfo,
    getTotalSupply,
    getOwnerVaults,
    mintVault,
    requestVerification,
    createVault,
    submitAsset,
    createAsset,
    getAssets,
    isLoading,
    error,
    contractAddresses,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;

export const useApp = () => {
  const context = useContext(AppContext);

  if(!context){
    throw new Error("useApp must be used within its provider...")
  }

  return context;
} 