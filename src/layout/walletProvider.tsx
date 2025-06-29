import { FC, ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './wagmi';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';


interface WalletContextProviderProps {
  children: ReactNode;
}


const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const client = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletContextProvider;
