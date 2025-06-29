import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Wallet, Activity } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import WalletConnectModal from './WalletConnectModal';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const location = useLocation();

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isActive = (path: string) => location.pathname === path;

  const handleConnectWallet = () => {
    if (isConnected) {
      // Disconnect wallet using wagmi
      disconnect();
    } else {
      // Open wallet connect modal
      setIsWalletModalOpen(true);
    }
  };

  const handleWalletConnect = async (walletType: string) => {
    try {
      // Find the connector based on wallet type
      const connector = connectors.find(c => {
        const name = c.name.toLowerCase();
        if (walletType === 'metamask') return name.includes('metamask');
        if (walletType === 'walletconnect') return name.includes('walletconnect');
        if (walletType === 'coinbase') return name.includes('coinbase');
        return false;
      });

      if (connector) {
        await connect({ connector });
        setIsWalletModalOpen(false);
      } else {
        console.error(`Connector for ${walletType} not found`);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VaultIQ 
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/create"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/create') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Create Vault
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/bridge"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/bridge') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Bridge
              </Link>
              <Link
                to="/activity"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/activity') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Activity className="h-4 w-4 inline mr-1" />
                Activity
              </Link>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleConnectWallet}
                disabled={isPending}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isConnected
                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                    : isPending
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isPending 
                    ? 'Connecting...' 
                    : isConnected 
                    ? formatAddress(address || '') 
                    : 'Connect Wallet'
                  }
                </span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/create"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/create') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Vault
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bridge"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/bridge') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bridge
                </Link>
                <Link
                  to="/activity"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/activity') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Activity className="h-4 w-4 inline mr-1" />
                  Activity
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </>
  );
};

export default Navbar;