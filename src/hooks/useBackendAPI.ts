import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

export interface AssetSubmission {
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

export function useBackendAPI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Submit asset with file upload
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit asset'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Create asset without file upload (for testing)
  const createAsset = async (assetData: Omit<AssetSubmission, 'fileUrl'>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${API_BASE_URL}/assets`, assetData)
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create asset'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Get all assets
  const getAssets = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${API_BASE_URL}/assets`)
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitAsset,
    createAsset,
    getAssets,
    isLoading,
    error,
  }
} 