// Contract ABIs and addresses
export const CONTRACT_ADDRESSES = {
  // Sepolia testnet addresses (replace with actual deployed addresses)
  sepolia: {
    vaultToken: '0x1234567890123456789012345678901234567890',
    vaultFactory: '0x2345678901234567890123456789012345678901',
    aiResultRegistry: '0x3456789012345678901234567890123456789012',
  },
  // Polygon mainnet addresses
  polygon: {
    vaultToken: '0x4567890123456789012345678901234567890123',
    vaultFactory: '0x5678901234567890123456789012345678901234',
    aiResultRegistry: '0x6789012345678901234567890123456789012345',
  }
}

// VaultToken ABI (ERC-721 with custom functions)
export const VAULT_TOKEN_ABI = [
  // ERC-721 standard functions
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ type: "uint256", name: "tokenId" }],
    name: "tokenURI",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ type: "uint256", name: "tokenId" }],
    name: "ownerOf",
    outputs: [{ type: "address", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ type: "address", name: "owner" }],
    name: "balanceOf",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { type: "address", name: "owner" },
      { type: "uint256", name: "index" }
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  
  // Custom VaultToken functions
  {
    inputs: [
      { type: "address", name: "to" },
      { type: "string", name: "tokenURI" }
    ],
    name: "mintVault",
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { type: "uint256", name: "tokenId" },
      { type: "string", name: "fileUrl" }
    ],
    name: "requestVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { type: "uint256", name: "tokenId" },
      { type: "string", name: "status" },
      { type: "uint256", name: "score" }
    ],
    name: "fulfillVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ type: "uint256", name: "tokenId" }],
    name: "verifications",
    outputs: [
      { type: "string", name: "status" },
      { type: "uint256", name: "score" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ type: "uint256", name: "tokenId" }],
    name: "proofOfReserveStatus",
    outputs: [{ type: "bool", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { type: "uint256", name: "tokenId" },
      { type: "bool", name: "simulatedResult" }
    ],
    name: "checkProofOfReserve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "isReserveVerified",
    outputs: [{ type: "bool", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ type: "bool", name: "status" }],
    name: "setReserveStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ type: "address", name: "minter" }],
    name: "addMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, type: "address", name: "from" },
      { indexed: true, type: "address", name: "to" },
      { indexed: true, type: "uint256", name: "tokenId" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, type: "uint256", name: "tokenId" },
      { indexed: false, type: "string", name: "fileUrl" }
    ],
    name: "VerificationRequested",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, type: "uint256", name: "tokenId" },
      { indexed: false, type: "string", name: "status" },
      { indexed: false, type: "uint256", name: "score" }
    ],
    name: "VerificationFulfilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, type: "uint256", name: "tokenId" },
      { indexed: false, type: "bool", name: "passed" }
    ],
    name: "ProofOfReserveChecked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, type: "address", name: "from" },
      { indexed: false, type: "string", name: "message" }
    ],
    name: "CCIPMessageReceived",
    type: "event"
  }
] as const

// VaultFactory ABI
export const VAULT_FACTORY_ABI = [
  {
    inputs: [
      { type: "address", name: "assetOwner" },
      { type: "bytes", name: "verificationProof" }
    ],
    name: "createVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "verifierContract",
    outputs: [{ type: "address", name: "" }],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, type: "address", name: "vaultAddress" }
    ],
    name: "VaultCreated",
    type: "event"
  }
] as const

// AIResultRegistry ABI (optional - for viewing verification results)
export const AI_RESULT_REGISTRY_ABI = [
  {
    inputs: [{ type: "bytes32", name: "hash" }],
    name: "getVerificationResult",
    outputs: [
      { type: "string", name: "status" },
      { type: "uint256", name: "score" },
      { type: "uint256", name: "timestamp" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { type: "bytes32", name: "hash" },
      { type: "string", name: "status" },
      { type: "uint256", name: "score" }
    ],
    name: "storeVerificationResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const 