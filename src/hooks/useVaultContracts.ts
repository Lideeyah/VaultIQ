import { useChainId, usePublicClient, useWalletClient, useReadContract, useWriteContract } from 'wagmi'
import { VAULT_TOKEN_ABI, VAULT_FACTORY_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'

export function useVaultContracts() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  
  // Get contract addresses for current network
  const getContractAddresses = () => {
    if (!chainId) return CONTRACT_ADDRESSES.sepolia // Default to Sepolia
    
    // Map chainId to network name
    const chainIdToNetwork: Record<number, keyof typeof CONTRACT_ADDRESSES> = {
      11155111: 'sepolia', // Sepolia testnet
      137: 'polygon',      // Polygon mainnet
    }
    
    const network = chainIdToNetwork[chainId]
    return network ? CONTRACT_ADDRESSES[network] : CONTRACT_ADDRESSES.sepolia
  }
  
  const addresses = getContractAddresses()
  
  // Contract instances using wagmi v2 syntax
  const vaultTokenContract = {
    address: addresses.vaultToken as `0x${string}`,
    abi: VAULT_TOKEN_ABI,
  }
  
  const vaultFactoryContract = {
    address: addresses.vaultFactory as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
  }
  
  // Read functions
  const getVaultTokenInfo = async (tokenId: number) => {
    if (!publicClient) return null
    
    try {
      const [owner, tokenURI, verification] = await Promise.all([
        publicClient.readContract({
          ...vaultTokenContract,
          functionName: 'ownerOf',
          args: [BigInt(tokenId)],
        }),
        publicClient.readContract({
          ...vaultTokenContract,
          functionName: 'tokenURI',
          args: [BigInt(tokenId)],
        }),
        publicClient.readContract({
          ...vaultTokenContract,
          functionName: 'verifications',
          args: [BigInt(tokenId)],
        }) as Promise<[string, bigint]>,
      ])
      
      return {
        owner,
        tokenURI,
        verification: {
          status: verification[0],
          score: Number(verification[1]),
        },
      }
    } catch (error) {
      console.error('Error fetching vault token info:', error)
      return null
    }
  }
  
  const getTotalSupply = async () => {
    if (!publicClient) return 0
    try {
      const result = await publicClient.readContract({
        ...vaultTokenContract,
        functionName: 'totalSupply',
      })
      return Number(result)
    } catch (error) {
      console.error('Error fetching total supply:', error)
      return 0
    }
  }
  
  const getOwnerVaults = async (ownerAddress: string) => {
    if (!publicClient) return []
    
    try {
      const balance = await publicClient.readContract({
        ...vaultTokenContract,
        functionName: 'balanceOf',
        args: [ownerAddress as `0x${string}`],
      })
      const vaults = []
      
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await publicClient.readContract({
          ...vaultTokenContract,
          functionName: 'tokenOfOwnerByIndex',
          args: [ownerAddress as `0x${string}`, BigInt(i)],
        })
        const tokenInfo = await getVaultTokenInfo(Number(tokenId))
        if (tokenInfo) {
          vaults.push({ tokenId: Number(tokenId), ...tokenInfo })
        }
      }
      
      return vaults
    } catch (error) {
      console.error('Error fetching owner vaults:', error)
      return []
    }
  }
  
  // Write functions
  const mintVault = async (to: string, tokenURI: string) => {
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }
    
    try {
      const hash = await walletClient.writeContract({
        ...vaultTokenContract,
        functionName: 'mintVault',
        args: [to as `0x${string}`, tokenURI],
      })
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      return receipt
    } catch (error) {
      console.error('Error minting vault:', error)
      throw error
    }
  }
  
  const requestVerification = async (tokenId: number, fileUrl: string) => {
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }
    
    try {
      const hash = await walletClient.writeContract({
        ...vaultTokenContract,
        functionName: 'requestVerification',
        args: [BigInt(tokenId), fileUrl],
      })
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      return receipt
    } catch (error) {
      console.error('Error requesting verification:', error)
      throw error
    }
  }
  
  const createVault = async (assetOwner: string, verificationProof: string) => {
    if (!walletClient) {
      throw new Error('Wallet client not available')
    }
    
    try {
      const hash = await walletClient.writeContract({
        ...vaultFactoryContract,
        functionName: 'createVault',
        args: [assetOwner as `0x${string}`, verificationProof as `0x${string}`],
      })
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      return receipt
    } catch (error) {
      console.error('Error creating vault:', error)
      throw error
    }
  }
  
  return {
    vaultTokenContract,
    vaultFactoryContract,
    getVaultTokenInfo,
    getTotalSupply,
    getOwnerVaults,
    mintVault,
    requestVerification,
    createVault,
    addresses,
  }
} 