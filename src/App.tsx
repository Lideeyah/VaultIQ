import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmi';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateVaultPage from './pages/CreateVaultPage';
import DashboardPage from './pages/DashboardPage';
import VaultDetailsPage from './pages/VaultDetailsPage';
import BridgePage from './pages/BridgePage';
import ActivityLogPage from './pages/ActivityLogPage';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProps } from './components/Toast';
import AuthContextProvider from './context/auth';
import AppContextProvider from './context/app';
import DashboardContextProvider from './context/dashboard';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <AppContextProvider>

        <ErrorBoundary>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateVaultPage />} />
                <Route path="/dashboard" element={<DashboardContextProvider> <DashboardPage /> </DashboardContextProvider>} />
                <Route path="/vault/:id" element={<VaultDetailsPage />} />
                <Route path="/bridge" element={<BridgePage />} />
                <Route path="/activity" element={<ActivityLogPage />} />
              </Routes>
            </Layout>
            <ToastContainer toasts={toasts} onClose={removeToast} />
          </Router>
        </ErrorBoundary>
          </AppContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;