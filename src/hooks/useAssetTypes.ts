export interface AssetType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export function useAssetTypes() {
  const assetTypes: AssetType[] = [
    { id: 'real-estate', name: 'Real Estate', icon: '🏠', description: 'Properties, land, buildings' },
    { id: 'vehicle', name: 'Vehicle', icon: '🚗', description: 'Cars, motorcycles, boats' },
    { id: 'art', name: 'Art & Collectibles', icon: '🎨', description: 'Artwork, antiques, collectibles' },
    { id: 'precious-metals', name: 'Precious Metals', icon: '💎', description: 'Gold, silver, jewelry' },
    { id: 'equipment', name: 'Equipment', icon: '⚙️', description: 'Industrial, medical equipment' },
    { id: 'other', name: 'Other', icon: '📦', description: 'Other valuable assets' }
  ];

  const getAssetTypeById = (id: string): AssetType | undefined => {
    return assetTypes.find(type => type.id === id);
  };

  const getAssetTypeName = (id: string): string => {
    const type = getAssetTypeById(id);
    return type ? type.name : 'Unknown';
  };

  const getAssetTypeIcon = (id: string): string => {
    const type = getAssetTypeById(id);
    return type ? type.icon : '📦';
  };

  return {
    assetTypes,
    getAssetTypeById,
    getAssetTypeName,
    getAssetTypeIcon,
  };
} 