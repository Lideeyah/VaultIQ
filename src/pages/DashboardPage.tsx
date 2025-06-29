import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, TrendingUp, Shield, Zap, MoreVertical, Eye, Send, Loader2, RefreshCw } from 'lucide-react';
import { vaults } from '../types/dashboard/vault.interface';
import { useApp } from '../context/app';
import { useAccount } from 'wagmi';

const DashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [vaultsData, setVaultsData] = useState<vaults[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { getAssets, isLoading: appLoading } = useApp();
  const { address, isConnected } = useAccount();

  // Fetch vaults data function
  const fetchVaults = async (isRefresh = false) => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const assets = await getAssets();
      console.log('Dashboard: Fetched assets:', assets);
      
      // Transform backend data to match vault interface
      const transformedVaults: vaults[] = assets.map((asset: any, index: number) => {
        const metadata = typeof asset.metadata === 'string' ? JSON.parse(asset.metadata) : asset.metadata;
        
        return {
          id: asset.id.toString(),
          name: metadata.name || `Asset ${asset.id}`,
          type: metadata.type || 'Unknown',
          value: metadata.value || '$0',
          aiScore: asset.score || 0,
          status: asset.status || 'Active',
          chain: 'Ethereum', // Default chain
          lastUpdate: new Date(asset.updatedAt || asset.createdAt).toLocaleDateString(),
          image: `https://picsum.photos/400/300?random=${asset.id}` // Placeholder image
        };
      });
      
      setVaultsData(transformedVaults);
    } catch (err) {
      console.error('Dashboard: Error fetching vaults:', err);
      setError('Failed to load vaults. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch vaults data on component mount
  useEffect(() => {
    fetchVaults();
  }, [isConnected]);

  // Refresh function
  const handleRefresh = () => {
    fetchVaults(true);
  };

  // Calculate portfolio stats from real data
  const portfolioStats = {
    totalValue: vaultsData.length > 0 
      ? `$${vaultsData.reduce((sum, vault) => {
          const value = parseFloat(vault.value.replace(/[$,]/g, '')) || 0;
          return sum + value;
        }, 0).toLocaleString()}`
      : '$0',
    totalVaults: vaultsData.length,
    avgAiScore: vaultsData.length > 0 
      ? Math.round(vaultsData.reduce((sum, vault) => sum + vault.aiScore, 0) / vaultsData.length)
      : 0,
    monthlyGrowth: '+12.3%' // This would need real historical data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Bridging': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'Ethereum': return 'bg-indigo-100 text-indigo-800';
      case 'Polygon': return 'bg-purple-100 text-purple-800';
      case 'Arbitrum': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVaults = vaultsData.filter(vault => {
    const matchesSearch = vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vault.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || vault.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Vault Portfolio</h1>
            <p className="text-gray-600">Manage your tokenized assets and track performance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || !isConnected}
              className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 transition-all"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Vault
            </Link>
          </div>
        </div>

        {/* Wallet Connection Check */}
        {!isConnected && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-yellow-800">Wallet Not Connected</h3>
                <p className="text-yellow-700">Please connect your wallet to view your vault portfolio.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-600 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || appLoading) && (
          <div className="mb-8 p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your vault portfolio...</p>
          </div>
        )}

        {/* Portfolio Stats */}
        {!isLoading && !appLoading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">{portfolioStats.monthlyGrowth}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{portfolioStats.totalValue}</div>
                <div className="text-gray-500 text-sm">Total Portfolio Value</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{portfolioStats.totalVaults}</div>
                <div className="text-gray-500 text-sm">Active Vaults</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{portfolioStats.avgAiScore}%</div>
                <div className="text-gray-500 text-sm">Avg AI Score</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-gray-500 text-sm">Chains Connected</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vaults..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="real estate">Real Estate</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
            </div>

            {/* Vaults Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVaults.map((vault) => (
                <div key={vault.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={vault.image}
                      alt={vault.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getChainColor(vault.chain)}`}>
                        {vault.chain}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{vault.name}</h3>
                        <p className="text-gray-500 text-sm">{vault.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vault.status)}`}>
                        {vault.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">Value</span>
                        <span className="font-bold text-lg text-gray-900">{vault.value}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">AI Score</span>
                        <div className="flex items-center">
                          <span className="font-semibold text-green-600 mr-2">{vault.aiScore}%</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full transition-all"
                              style={{ width: `${vault.aiScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Last updated: {vault.lastUpdate}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/vault/${vault.id}`}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                      <Link
                        to="/bridge"
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Bridge
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVaults.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {vaultsData.length === 0 ? 'No vaults found. Create your first vault to get started!' : 'No vaults found matching your criteria'}
                </div>
                <Link
                  to="/create"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Vault
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;