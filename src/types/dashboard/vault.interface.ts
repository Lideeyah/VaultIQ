
export interface vaults {
    id: string;
    name: string;
    type: string;
    value: string;
    aiScore: number;
    status: string;
    chain: string;
    lastUpdate: string;
    image: string;
}

export interface Vault {
    id: string;
    name: string;
    type: string;
    value: string;
    aiScore: number;
    status: 'Active' | 'Inactive' | string;
    chain: string;
    contractAddress: string;
    tokenId: string;
    createdDate: string;
    lastUpdate: string;
    image: string;
    description: string;
    documents: DocumentItem[];
    aiVerification: AIVerification;
    proofOfReserve: ProofOfReserve;
    priceHistory: PricePoint[];
  }
  
  interface DocumentItem {
    name: string;
    type: string;
    size: string;
    verified: boolean;
  }
  
  interface AIVerification {
    score: number;
    confidence: 'High' | 'Medium' | 'Low' | string;
    riskLevel: 'Low' | 'Medium' | 'High' | string;
    details: {
      documentAuthenticity: number;
      visualConsistency: number;
      marketValidation: number;
    };
  }
  
  interface ProofOfReserve {
    verified: boolean;
    lastCheck: string;
    reserveRatio: string;
    custodian: string;
  }
  
  interface PricePoint {
    date: string;
    price: number;
  }
  