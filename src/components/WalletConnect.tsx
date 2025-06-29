import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { sepolia, polygon } from 'wagmi/chains'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={!connector.ready}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
} 