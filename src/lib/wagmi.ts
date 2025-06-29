import { createConfig, http } from 'wagmi'
import { sepolia, polygon } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Set up wagmi config
export const config = createConfig({
  chains: [sepolia, polygon],
  connectors: [
    injected(),
    walletConnect({
      projectId: 'c4f79cc821944d9680842e34466bfbd9', // Default test project ID
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
}) 