"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { Home, FileText } from "lucide-react" // Import icons

// Contract addresses
const TBOND_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TBOND_CONTRACT_ADDRESS || "0xee078E77Cfa9Dc36965EA15A78F1b9B6bf0c14D4"
const PROPERTY_DEED_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_PROPERTY_DEED_CONTRACT_ADDRESS || "0x6D1DE98E19e289e646Fd5D47DF8ff3B35740e7a7"
const AED_LST_CONTRACT_ADDRESS = "0x40Cf55c7992ec5156a275b363f9B9C22e09D08cc"
const NFT_STAKING_VAULT_ADDRESS = "0x56B1776c21ebC3950dBc9b84ea8CEB88471FF35b"

// ERC-1155 ABI (for balanceOf)
const erc1155ABI = [
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
]

// ERC-20 ABI (for balanceOf)
const erc20ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

// NFT Staking Vault ABI
const nftStakingVaultABI = [
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "lockDuration", type: "uint256" },
    ],
    name: "stakeNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "unstakeNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "staker", type: "address" }],
    name: "getStakedNFTs",
    outputs: [
      { internalType: "address[]", name: "nftContracts", type: "address[]" },
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
      { internalType: "uint256[]", name: "stakeTimes", type: "uint256[]" },
      { internalType: "uint256[]", name: "lockDurations", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "lockDuration", type: "uint256" },
    ],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "getNFTTier",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

// Token ID ranges to check
const TBOND_ID_RANGE = { start: 1, end: 100 }
const PROPERTY_DEED_ID_RANGE = { start: 1000, end: 2000 }
const BATCH_SIZE = 10

// Lock duration options in days
const LOCK_DURATIONS = [
  { days: 30, label: "1 Month", unlockPercentage: 10 },
  { days: 90, label: "3 Months", unlockPercentage: 20 },
  { days: 180, label: "6 Months", unlockPercentage: 35 },
  { days: 270, label: "9 Months", unlockPercentage: 50 },
  { days: 365, label: "12 Months", unlockPercentage: 75 },
  { days: 540, label: "18 Months", unlockPercentage: 100 },
]

// NFT Types
type NFTType = "tbond" | "property-deed"

// NFT Item interface
interface NFTItem {
  type: NFTType
  id: number
  contract: string
  tier: number
  value: number
}

// Staked NFT interface
interface StakedNFT {
  contract: string
  tokenId: number
  stakeTime: number
  lockDuration: number
  unlockTime: number
  type: NFTType
  tier: number
  value: number
  reward: number
}

// Status message interface
interface StatusMessage {
  type: "success" | "error" | "loading" | "info" | null
  message: string
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: "#000000", // Updated to match dark theme
  },
  main: {
    flex: 1,
    padding: "2rem 1rem",
    backgroundColor: "#000000", // Updated to match dark theme
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#ffffff", // White text
  },
  subtitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff", // White text
  },
  card: {
    backgroundColor: "#111111", // Updated to match dark theme
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #222222", // Updated to match dark theme
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  infoCard: {
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    border: "1px solid rgba(255, 107, 0, 0.3)",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginBottom: "1.5rem",
  },
  infoTitle: {
    color: "#ff6b00",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  infoText: {
    color: "#ffffff",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  tabs: {
    display: "flex",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #222222", // Updated to match dark theme
  },
  tab: {
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    color: "#999999",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#ffffff",
    borderBottom: "2px solid #ff6b00",
  },
  nftGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  nftItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.375rem",
    padding: "1rem",
    border: "1px solid #333333",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative" as const,
  },
  tbondItem: {
    borderLeft: "4px solid #ff6b00", // Orange accent for T-Bonds
  },
  propertyDeedItem: {
    borderLeft: "4px solid #00c853", // Green accent for Property Deeds
  },
  nftItemSelected: {
    borderColor: "#ff6b00",
    boxShadow: "0 0 0 1px #ff6b00",
  },
  nftItemHover: {
    backgroundColor: "#222222",
  },
  nftId: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1.125rem",
    marginBottom: "0.25rem",
  },
  nftType: {
    color: "#999999",
    fontSize: "0.75rem",
    marginBottom: "0.5rem",
  },
  tbondType: {
    color: "#ff6b00", // Orange for T-Bonds
  },
  propertyDeedType: {
    color: "#00c853", // Green for Property Deeds
  },
  nftValue: {
    color: "#ff6b00",
    fontWeight: "500",
    fontSize: "0.875rem",
  },
  nftTier: {
    position: "absolute" as const,
    top: "0.5rem",
    right: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  tbondTier: {
    color: "#ff6b00", // Orange for T-Bonds
  },
  propertyDeedTier: {
    color: "#00c853", // Green for Property Deeds
  },
  checkboxContainer: {
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    accentColor: "#ff6b00",
    marginRight: "0.5rem",
    width: "16px",
    height: "16px",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#ffffff",
    fontWeight: "500",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: "0.375rem",
    color: "#ffffff",
    fontSize: "1rem",
    appearance: "none",
    backgroundImage:
      'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
  },
  button: {
    backgroundColor: "#ff6b00", // Orange button
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    width: "100%",
    textAlign: "center" as const,
  },
  buttonHover: {
    backgroundColor: "#e05e00", // Darker orange on hover
  },
  disabledButton: {
    backgroundColor: "#7d3500", // Darker orange for disabled state
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "not-allowed",
  },
  calculationCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginTop: "1.5rem",
  },
  calculationTitle: {
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: "0.75rem",
  },
  calculationRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  calculationLabel: {
    color: "#999999",
  },
  calculationValue: {
    color: "#ffffff",
  },
  calculationTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0.75rem",
    paddingTop: "0.75rem",
    borderTop: "1px solid #333333",
  },
  calculationTotalLabel: {
    color: "#ffffff",
    fontWeight: "500",
  },
  calculationTotalValue: {
    color: "#ff6b00",
    fontWeight: "bold",
  },
  stakedNftCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginBottom: "1rem",
    border: "1px solid #333333",
  },
  tbondStakedCard: {
    borderLeft: "4px solid #ff6b00", // Orange accent for T-Bonds
  },
  propertyDeedStakedCard: {
    borderLeft: "4px solid #00c853", // Green accent for Property Deeds
  },
  stakedNftHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
  },
  stakedNftTitle: {
    color: "#ffffff",
    fontWeight: "500",
  },
  stakedNftType: {
    color: "#999999",
    fontSize: "0.875rem",
  },
  stakedNftDetails: {
    marginBottom: "0.75rem",
  },
  stakedNftRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.25rem",
  },
  stakedNftLabel: {
    color: "#999999",
    fontSize: "0.875rem",
  },
  stakedNftValue: {
    color: "#ffffff",
    fontSize: "0.875rem",
  },
  stakedNftReward: {
    color: "#ff6b00",
    fontWeight: "500",
  },
  stakedNftProgress: {
    height: "0.5rem",
    backgroundColor: "#333333",
    borderRadius: "9999px",
    marginBottom: "0.75rem",
    overflow: "hidden",
  },
  stakedNftProgressBar: {
    height: "100%",
    backgroundColor: "#ff6b00",
    borderRadius: "9999px",
  },
  tbondProgressBar: {
    backgroundColor: "#ff6b00", // Orange for T-Bonds
  },
  propertyDeedProgressBar: {
    backgroundColor: "#00c853", // Green for Property Deeds
  },
  stakedNftActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  stakedNftButton: {
    backgroundColor: "transparent",
    color: "#ff6b00",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    border: "1px solid #ff6b00",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "background-color 0.2s",
  },
  stakedNftButtonHover: {
    backgroundColor: "rgba(255, 107, 0, 0.1)",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "2rem 0",
  },
  emptyStateMessage: {
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "1rem",
  },
  emptyStateSubMessage: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.5)",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  loadingText: {
    color: "#999999",
    fontSize: "0.875rem",
  },
  errorMessage: {
    color: "#ff4d4f",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
    whiteSpace: "pre-wrap",
  },
  successMessage: {
    color: "#52c41a",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  selectedCount: {
    backgroundColor: "#ff6b00",
    color: "#ffffff",
    borderRadius: "9999px",
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    marginLeft: "0.5rem",
  },
  batchActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#ff6b00",
    border: "1px solid #ff6b00",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
}

// Update the component to support multiple selection
export default function Staking() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake")
  const [ownedNFTs, setOwnedNFTs] = useState<NFTItem[]>([])
  const [stakedNFTs, setStakedNFTs] = useState<StakedNFT[]>([])
  const [selectedNFTs, setSelectedNFTs] = useState<NFTItem[]>([]) // Changed to array for multi-select
  const [selectedDuration, setSelectedDuration] = useState<number>(LOCK_DURATIONS[0].days)
  const [calculatedReward, setCalculatedReward] = useState<number>(0)
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)
  const [isLoadingStaked, setIsLoadingStaked] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aedLstBalance, setAedLstBalance] = useState<string>("0")
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    type: null,
    message: "",
  })

  // Function to toggle NFT selection
  const toggleNFTSelection = (nft: NFTItem) => {
    if (selectedNFTs.some((item) => item.type === nft.type && item.id === nft.id)) {
      setSelectedNFTs(selectedNFTs.filter((item) => !(item.type === nft.type && item.id === nft.id)))
    } else {
      setSelectedNFTs([...selectedNFTs, nft])
    }
  }

  // Function to check if an NFT is selected
  const isNFTSelected = (nft: NFTItem) => {
    return selectedNFTs.some((item) => item.type === nft.type && item.id === nft.id)
  }

  // Function to fetch owned NFTs
  const fetchOwnedNFTs = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      setOwnedNFTs([])
      return
    }

    setIsLoadingNFTs(true)
    try {
      const ownedItems: NFTItem[] = []

      // Check T-Bond balances
      for (let i = TBOND_ID_RANGE.start; i <= TBOND_ID_RANGE.end; i += BATCH_SIZE) {
        const endBatch = Math.min(i + BATCH_SIZE - 1, TBOND_ID_RANGE.end)
        const batchPromises = []

        for (let id = i; id <= endBatch; id++) {
          batchPromises.push(
            publicClient
              .readContract({
                address: TBOND_CONTRACT_ADDRESS as `0x${string}`,
                abi: erc1155ABI,
                functionName: "balanceOf",
                args: [address, BigInt(id)],
              })
              .then((balance: bigint) => {
                if (balance > 0n) {
                  // Get NFT tier (mock for now)
                  const tier = 1 // T-Bonds are Tier 1
                  const value = 1000 // $1,000 per T-Bond

                  ownedItems.push({
                    type: "tbond",
                    id,
                    contract: TBOND_CONTRACT_ADDRESS,
                    tier,
                    value,
                  })
                }
                return balance
              })
              .catch(() => 0n), // Ignore errors for individual token IDs
          )
        }

        await Promise.all(batchPromises)
        await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay to avoid rate limiting
      }

      // Check Property Deed balances
      for (let i = PROPERTY_DEED_ID_RANGE.start; i <= PROPERTY_DEED_ID_RANGE.end; i += BATCH_SIZE) {
        const endBatch = Math.min(i + BATCH_SIZE - 1, PROPERTY_DEED_ID_RANGE.end)
        const batchPromises = []

        for (let id = i; id <= endBatch; id++) {
          batchPromises.push(
            publicClient
              .readContract({
                address: PROPERTY_DEED_CONTRACT_ADDRESS as `0x${string}`,
                abi: erc1155ABI,
                functionName: "balanceOf",
                args: [address, BigInt(id)],
              })
              .then((balance: bigint) => {
                if (balance > 0n) {
                  // Get NFT tier (mock for now)
                  const tier = 2 // Property Deeds are Tier 2
                  const value = 100000 // $100,000 per Property Deed

                  ownedItems.push({
                    type: "property-deed",
                    id,
                    contract: PROPERTY_DEED_CONTRACT_ADDRESS,
                    tier,
                    value,
                  })
                }
                return balance
              })
              .catch(() => 0n), // Ignore errors for individual token IDs
          )
        }

        await Promise.all(batchPromises)
        await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay to avoid rate limiting
      }

      setOwnedNFTs(ownedItems)
    } catch (error) {
      console.error("Error fetching owned NFTs:", error)
      // Fallback to some example NFTs if there's an error
      setOwnedNFTs([
        {
          type: "tbond",
          id: 1,
          contract: TBOND_CONTRACT_ADDRESS,
          tier: 1,
          value: 1000,
        },
        {
          type: "tbond",
          id: 2,
          contract: TBOND_CONTRACT_ADDRESS,
          tier: 1,
          value: 1000,
        },
        {
          type: "property-deed",
          id: 1001,
          contract: PROPERTY_DEED_CONTRACT_ADDRESS,
          tier: 2,
          value: 100000,
        },
      ])
    } finally {
      setIsLoadingNFTs(false)
    }
  }, [address, isConnected, publicClient])

  // Function to fetch staked NFTs
  const fetchStakedNFTs = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      setStakedNFTs([])
      return
    }

    setIsLoadingStaked(true)
    try {
      // Call the getStakedNFTs function on the vault contract
      const result = await publicClient.readContract({
        address: NFT_STAKING_VAULT_ADDRESS as `0x${string}`,
        abi: nftStakingVaultABI,
        functionName: "getStakedNFTs",
        args: [address],
      })

      if (!result || !Array.isArray(result) || result.length !== 4) {
        throw new Error("Invalid response from getStakedNFTs")
      }

      const [nftContracts, tokenIds, stakeTimes, lockDurations] = result as [string[], bigint[], bigint[], bigint[]]

      const stakedItems: StakedNFT[] = []

      for (let i = 0; i < nftContracts.length; i++) {
        const contract = nftContracts[i]
        const tokenId = Number(tokenIds[i])
        const stakeTime = Number(stakeTimes[i])
        const lockDuration = Number(lockDurations[i])
        const unlockTime = stakeTime + lockDuration

        // Determine NFT type and tier based on contract address
        let type: NFTType
        let tier: number
        let value: number

        if (contract.toLowerCase() === TBOND_CONTRACT_ADDRESS.toLowerCase()) {
          type = "tbond"
          tier = 1
          value = 1000
        } else if (contract.toLowerCase() === PROPERTY_DEED_CONTRACT_ADDRESS.toLowerCase()) {
          type = "property-deed"
          tier = 2
          value = 100000
        } else {
          // Skip unknown contracts
          continue
        }

        // Calculate reward based on lock duration and value
        const durationInDays = lockDuration / 86400 // Convert seconds to days
        const unlockPercentage = LOCK_DURATIONS.find((d) => d.days === durationInDays)?.unlockPercentage || 0
        const reward = (value * unlockPercentage) / 100

        stakedItems.push({
          contract,
          tokenId,
          stakeTime,
          lockDuration,
          unlockTime,
          type,
          tier,
          value,
          reward,
        })
      }

      setStakedNFTs(stakedItems)
    } catch (error) {
      console.error("Error fetching staked NFTs:", error)
      // Fallback to some example staked NFTs if there's an error
      const now = Math.floor(Date.now() / 1000)
      setStakedNFTs([
        {
          contract: TBOND_CONTRACT_ADDRESS,
          tokenId: 5,
          stakeTime: now - 86400 * 15, // Staked 15 days ago
          lockDuration: 86400 * 30, // 30 days lock
          unlockTime: now + 86400 * 15, // Unlocks in 15 days
          type: "tbond",
          tier: 1,
          value: 1000,
          reward: 100, // 10% of 1000
        },
        {
          contract: PROPERTY_DEED_CONTRACT_ADDRESS,
          tokenId: 1005,
          stakeTime: now - 86400 * 30, // Staked 30 days ago
          lockDuration: 86400 * 180, // 180 days lock
          unlockTime: now + 86400 * 150, // Unlocks in 150 days
          type: "property-deed",
          tier: 2,
          value: 100000,
          reward: 35000, // 35% of 100000
        },
      ])
    } finally {
      setIsLoadingStaked(false)
    }
  }, [address, isConnected, publicClient])

  // Function to check AED LST balance
  const checkAedLstBalance = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      setAedLstBalance("0")
      return
    }

    try {
      const balance = await publicClient.readContract({
        address: AED_LST_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      })

      // Convert from wei to AED LST (assuming 18 decimals)
      const balanceInAedLst = Number(balance) / 10 ** 18
      setAedLstBalance(balanceInAedLst.toFixed(2))
    } catch (error) {
      console.error("Error checking AED LST balance:", error)
      setAedLstBalance("0")
    }
  }, [address, isConnected, publicClient])

  // Function to check if NFT contract is approved for the vault
  const checkApproval = useCallback(async () => {
    if (!isConnected || !address || !publicClient || selectedNFTs.length === 0) {
      setIsApproved(false)
      return
    }

    try {
      // Check approval for each unique contract in the selected NFTs
      const uniqueContracts = [...new Set(selectedNFTs.map((nft) => nft.contract))]
      const approvalPromises = uniqueContracts.map((contract) =>
        publicClient.readContract({
          address: contract as `0x${string}`,
          abi: erc1155ABI,
          functionName: "isApprovedForAll",
          args: [address, NFT_STAKING_VAULT_ADDRESS],
        }),
      )

      const approvalResults = await Promise.all(approvalPromises)
      // All contracts must be approved
      setIsApproved(approvalResults.every((result) => !!result))
    } catch (error) {
      console.error("Error checking approval:", error)
      setIsApproved(false)
    }
  }, [address, isConnected, publicClient, selectedNFTs])

  // Function to approve NFT contract for the vault
  const approveNFTContract = useCallback(async () => {
    if (!isConnected || !address || !walletClient || !publicClient || selectedNFTs.length === 0) {
      throw new Error("Wallet not connected or no NFTs selected")
    }

    try {
      // Approve each unique contract in the selected NFTs
      const uniqueContracts = [...new Set(selectedNFTs.map((nft) => nft.contract))]

      for (const contract of uniqueContracts) {
        const { request } = await publicClient.simulateContract({
          address: contract as `0x${string}`,
          abi: erc1155ABI,
          functionName: "setApprovalForAll",
          args: [NFT_STAKING_VAULT_ADDRESS, true],
          account: address,
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })
      }

      setIsApproved(true)
      return true
    } catch (error) {
      console.error("Error approving NFT contract:", error)
      throw error
    }
  }, [address, isConnected, publicClient, selectedNFTs, walletClient])

  // Function to calculate reward based on selected NFTs and duration
  const calculateReward = useCallback(() => {
    if (selectedNFTs.length === 0 || !selectedDuration) {
      setCalculatedReward(0)
      return
    }

    try {
      // Find the unlock percentage for the selected duration
      const unlockPercentage = LOCK_DURATIONS.find((d) => d.days === selectedDuration)?.unlockPercentage || 0

      // Calculate total reward based on all selected NFTs
      const totalReward = selectedNFTs.reduce((sum, nft) => {
        const nftReward = (nft.value * unlockPercentage) / 100
        return sum + nftReward
      }, 0)

      setCalculatedReward(totalReward)
    } catch (error) {
      console.error("Error calculating reward:", error)
      setCalculatedReward(0)
    }
  }, [selectedNFTs, selectedDuration])

  // Function to stake NFTs in batch
  const stakeNFTs = async () => {
    if (!isConnected || !address || !walletClient || !publicClient || selectedNFTs.length === 0) {
      setStatusMessage({
        type: "error",
        message: "Wallet not connected or no NFTs selected",
      })
      return
    }

    if (!selectedDuration) {
      setStatusMessage({
        type: "error",
        message: "Please select a lock duration",
      })
      return
    }

    setIsProcessing(true)
    setStatusMessage({
      type: "loading",
      message: "Processing your transaction...",
    })

    try {
      // Check if NFT contracts are approved for the vault
      if (!isApproved) {
        setStatusMessage({
          type: "loading",
          message: "Step 1/2: Approving NFT contracts...",
        })

        try {
          await approveNFTContract()
          setStatusMessage({
            type: "loading",
            message: "NFT contracts approved! Proceeding to stake...",
          })
        } catch (error) {
          console.error("Error approving NFT contracts:", error)
          throw new Error("Failed to approve NFT contracts. Please try again.")
        }
      }

      // Stake each NFT
      setStatusMessage({
        type: "loading",
        message: isApproved ? "Staking NFTs..." : "Step 2/2: Staking NFTs...",
      })

      try {
        // Process NFTs in batches by contract to reduce gas costs
        const nftsByContract: Record<string, NFTItem[]> = {}

        // Group NFTs by contract
        selectedNFTs.forEach((nft) => {
          if (!nftsByContract[nft.contract]) {
            nftsByContract[nft.contract] = []
          }
          nftsByContract[nft.contract].push(nft)
        })

        // Process each contract's NFTs
        for (const [contract, nfts] of Object.entries(nftsByContract)) {
          for (const nft of nfts) {
            const { request } = await publicClient.simulateContract({
              address: NFT_STAKING_VAULT_ADDRESS as `0x${string}`,
              abi: nftStakingVaultABI,
              functionName: "stakeNFT",
              args: [
                nft.contract,
                BigInt(nft.id),
                BigInt(selectedDuration * 86400), // Convert days to seconds
              ],
              account: address,
            })

            const hash = await walletClient.writeContract(request)
            await publicClient.waitForTransactionReceipt({ hash })
          }
        }

        setStatusMessage({
          type: "success",
          message: `Successfully staked ${selectedNFTs.length} NFT(s) for ${LOCK_DURATIONS.find((d) => d.days === selectedDuration)?.label}!`,
        })

        // Refresh data
        setTimeout(() => {
          fetchOwnedNFTs()
          fetchStakedNFTs()
          checkAedLstBalance()
          setSelectedNFTs([])
          setCalculatedReward(0)
        }, 2000)
      } catch (error) {
        console.error("Error staking NFTs:", error)
        throw error
      }
    } catch (error) {
      console.error("Error in staking process:", error)

      let errorMessage = "Failed to complete the transaction. "

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase()

        // Check for common staking errors
        if (errorStr.includes("execution reverted")) {
          errorMessage = "Transaction failed. This could be due to:"
          errorMessage += "\n- The NFT may already be staked"
          errorMessage += "\n- You may not have permission to stake this NFT"
          errorMessage += "\n- The contract may be paused or have reached its limit"
          errorMessage += "\n\nPlease try again with a different NFT or contact support."
        } else if (errorStr.includes("user rejected")) {
          errorMessage = "Transaction was rejected in your wallet."
        } else if (errorStr.includes("insufficient funds")) {
          errorMessage = "You don't have enough ETH to pay for gas fees."
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += "Unknown error occurred."
      }

      setStatusMessage({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to unstake NFT
  const unstakeNFT = async (stakedNFT: StakedNFT) => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setStatusMessage({
        type: "error",
        message: "Wallet not connected",
      })
      return
    }

    setIsProcessing(true)
    setStatusMessage({
      type: "loading",
      message: "Processing your transaction...",
    })

    try {
      const { request } = await publicClient.simulateContract({
        address: NFT_STAKING_VAULT_ADDRESS as `0x${string}`,
        abi: nftStakingVaultABI,
        functionName: "unstakeNFT",
        args: [stakedNFT.contract, BigInt(stakedNFT.tokenId)],
        account: address,
      })

      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })

      setStatusMessage({
        type: "success",
        message: `Successfully unstaked ${stakedNFT.type === "tbond" ? "T-Bond" : "Property Deed"} #${
          stakedNFT.tokenId
        }!`,
      })

      // Refresh data
      setTimeout(() => {
        fetchOwnedNFTs()
        fetchStakedNFTs()
        checkAedLstBalance()
      }, 2000)
    } catch (error) {
      console.error("Error unstaking NFT:", error)

      let errorMessage = "Failed to complete the transaction. "

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase()

        // Check for common unstaking errors
        if (errorStr.includes("execution reverted")) {
          errorMessage = "Transaction failed. This could be due to:"
          errorMessage += "\n- The NFT may not be staked"
          errorMessage += "\n- The lock period may not have ended yet"
          errorMessage += "\n- The contract may be paused"
          errorMessage += "\n\nPlease verify the NFT status and try again later."
        } else if (errorStr.includes("user rejected")) {
          errorMessage = "Transaction was rejected in your wallet."
        } else if (errorStr.includes("insufficient funds")) {
          errorMessage = "You don't have enough ETH to pay for gas fees."
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += "Unknown error occurred."
      }

      setStatusMessage({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate reward when selected NFTs or duration changes
  useEffect(() => {
    calculateReward()
  }, [calculateReward, selectedNFTs, selectedDuration])

  // Check approval when selected NFTs change
  useEffect(() => {
    checkApproval()
  }, [checkApproval, selectedNFTs, address, publicClient])

  // Fetch data on component mount and when address changes
  useEffect(() => {
    if (isConnected && address && publicClient) {
      fetchOwnedNFTs()
      fetchStakedNFTs()
      checkAedLstBalance()
    } else {
      setOwnedNFTs([])
      setStakedNFTs([])
      setAedLstBalance("0")
    }
  }, [isConnected, address, publicClient, fetchOwnedNFTs, fetchStakedNFTs, checkAedLstBalance])

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  // Calculate progress percentage for staked NFT
  const calculateProgress = (stakeTime: number, unlockTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const totalDuration = unlockTime - stakeTime
    const elapsed = now - stakeTime

    if (elapsed <= 0) return 0
    if (elapsed >= totalDuration) return 100

    return Math.floor((elapsed / totalDuration) * 100)
  }

  // Convert USD to AED
  const convertUSDtoAED = (usdValue: number): number => {
    const aedRate = 3.67 // 1 USD = 3.67 AED
    return usdValue * aedRate
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.title}>NFT Staking</h1>

          <div style={styles.infoCard}>
            <div style={styles.infoTitle}>About NFT Staking</div>
            <div style={styles.infoText}>
              Stake your T-Bonds and Property Deeds to earn AED LST tokens. The longer you lock your NFTs, the higher
              the percentage of tokens you'll receive. You can unstake your NFTs at any time after the lock period ends.
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.tabs}>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "stake" ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab("stake")}
              >
                Stake NFTs
              </div>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "unstake" ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab("unstake")}
              >
                Staked NFTs
              </div>
            </div>

            {activeTab === "stake" ? (
              <div>
                <div style={styles.subtitle}>Your NFTs</div>
                <div style={{ color: "#999999", marginBottom: "1rem" }}>
                  AED LST Balance:{" "}
                  <span style={{ color: "#ff6b00" }}>
                    {convertUSDtoAED(Number.parseFloat(aedLstBalance)).toFixed(2)} AED LST
                  </span>
                </div>

                {isLoadingNFTs ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingText}>Loading your NFTs...</div>
                  </div>
                ) : ownedNFTs.length > 0 ? (
                  <div>
                    {selectedNFTs.length > 0 && (
                      <div style={styles.batchActions}>
                        <div>
                          <span>Selected NFTs:</span>
                          <span style={styles.selectedCount}>{selectedNFTs.length}</span>
                        </div>
                        <button
                          style={{
                            ...styles.secondaryButton,
                            padding: "0.25rem 0.75rem",
                            fontSize: "0.875rem",
                          }}
                          onClick={() => setSelectedNFTs([])}
                        >
                          Clear Selection
                        </button>
                      </div>
                    )}

                    <div style={styles.nftGrid}>
                      {ownedNFTs.map((nft) => (
                        <div
                          key={`${nft.type}-${nft.id}`}
                          style={{
                            ...styles.nftItem,
                            ...(nft.type === "tbond" ? styles.tbondItem : styles.propertyDeedItem),
                            ...(isNFTSelected(nft) ? styles.nftItemSelected : {}),
                          }}
                          onClick={() => toggleNFTSelection(nft)}
                          onMouseEnter={(e) => {
                            if (!isNFTSelected(nft)) {
                              e.currentTarget.style.backgroundColor = styles.nftItemHover.backgroundColor
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isNFTSelected(nft)) {
                              e.currentTarget.style.backgroundColor = styles.nftItem.backgroundColor
                            }
                          }}
                        >
                          <div style={styles.nftTier}>
                            {nft.type === "tbond" ? (
                              <FileText size={16} color="#ff6b00" />
                            ) : (
                              <Home size={16} color="#00c853" />
                            )}
                          </div>
                          <div style={styles.nftId}>#{nft.id}</div>
                          <div
                            style={{
                              ...styles.nftType,
                              ...(nft.type === "tbond" ? styles.tbondType : styles.propertyDeedType),
                            }}
                          >
                            {nft.type === "tbond" ? "T-Bond" : "Property Deed"}
                          </div>
                          <div style={styles.nftValue}>${nft.value.toLocaleString()}</div>
                          <div style={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              style={styles.checkbox}
                              checked={isNFTSelected(nft)}
                              onChange={() => toggleNFTSelection(nft)}
                            />
                            <span style={{ color: "#ffffff", fontSize: "0.875rem" }}>Select</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedNFTs.length > 0 && (
                      <div>
                        <div style={styles.formGroup}>
                          <label style={styles.label} htmlFor="duration">
                            Lock Duration
                          </label>
                          <select
                            id="duration"
                            style={styles.select}
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(Number(e.target.value))}
                            disabled={isProcessing}
                          >
                            {LOCK_DURATIONS.map((duration) => (
                              <option key={duration.days} value={duration.days}>
                                {duration.label} - {duration.unlockPercentage}% Unlock
                              </option>
                            ))}
                          </select>
                        </div>

                        <div style={styles.calculationCard}>
                          <div style={styles.calculationTitle}>Staking Calculation</div>
                          <div style={styles.calculationRow}>
                            <span style={styles.calculationLabel}>Selected NFTs:</span>
                            <span style={styles.calculationValue}>{selectedNFTs.length}</span>
                          </div>
                          <div style={styles.calculationRow}>
                            <span style={styles.calculationLabel}>Total NFT Value:</span>
                            <span style={styles.calculationValue}>
                              ${selectedNFTs.reduce((sum, nft) => sum + nft.value, 0).toLocaleString()}
                            </span>
                          </div>
                          <div style={styles.calculationRow}>
                            <span style={styles.calculationLabel}>Lock Duration:</span>
                            <span style={styles.calculationValue}>
                              {LOCK_DURATIONS.find((d) => d.days === selectedDuration)?.label}
                            </span>
                          </div>
                          <div style={styles.calculationRow}>
                            <span style={styles.calculationLabel}>Unlock Percentage:</span>
                            <span style={styles.calculationValue}>
                              {LOCK_DURATIONS.find((d) => d.days === selectedDuration)?.unlockPercentage}%
                            </span>
                          </div>
                          <div style={styles.calculationTotal}>
                            <span style={styles.calculationTotalLabel}>AED LST Tokens:</span>
                            <span style={styles.calculationTotalValue}>
                              {convertUSDtoAED(calculatedReward).toLocaleString()} AED LST
                            </span>
                          </div>
                        </div>

                        <button
                          style={{
                            ...styles.button,
                            marginTop: "1.5rem",
                            ...(isProcessing ? styles.disabledButton : {}),
                          }}
                          onClick={stakeNFTs}
                          disabled={isProcessing}
                          onMouseEnter={(e) => {
                            if (!isProcessing) {
                              e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isProcessing) {
                              e.currentTarget.style.backgroundColor = styles.button.backgroundColor
                            }
                          }}
                        >
                          {isProcessing
                            ? "Processing..."
                            : `Stake ${selectedNFTs.length} NFT${selectedNFTs.length > 1 ? "s" : ""}`}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyStateMessage}>You don't have any NFTs to stake</p>
                    <p style={styles.emptyStateSubMessage}>Purchase T-Bonds or Property Deeds to start staking</p>
                  </div>
                )}

                {statusMessage.type && (
                  <div
                    style={{
                      color:
                        statusMessage.type === "error"
                          ? "#ff4d4f"
                          : statusMessage.type === "success"
                            ? "#52c41a"
                            : statusMessage.type === "info"
                              ? "#1890ff"
                              : "#ff6b00",
                      marginTop: "1rem",
                    }}
                  >
                    {statusMessage.message}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={styles.subtitle}>Your Staked NFTs</div>
                <div style={{ color: "#999999", marginBottom: "1rem" }}>
                  AED LST Balance:{" "}
                  <span style={{ color: "#ff6b00" }}>
                    {convertUSDtoAED(Number.parseFloat(aedLstBalance)).toFixed(2)} AED LST
                  </span>
                </div>

                {isLoadingStaked ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingText}>Loading your staked NFTs...</div>
                  </div>
                ) : stakedNFTs.length > 0 ? (
                  <div>
                    {stakedNFTs.map((nft) => {
                      const progress = calculateProgress(nft.stakeTime, nft.unlockTime)
                      const now = Math.floor(Date.now() / 1000)
                      const isUnlocked = now >= nft.unlockTime

                      return (
                        <div
                          key={`${nft.contract}-${nft.tokenId}`}
                          style={{
                            ...styles.stakedNftCard,
                            ...(nft.type === "tbond" ? styles.tbondStakedCard : styles.propertyDeedStakedCard),
                          }}
                        >
                          <div style={styles.stakedNftHeader}>
                            <div style={styles.stakedNftTitle}>
                              {nft.type === "tbond" ? "T-Bond" : "Property Deed"} #{nft.tokenId}
                            </div>
                            <div style={styles.nftTier}>
                              {nft.type === "tbond" ? (
                                <FileText size={16} color="#ff6b00" />
                              ) : (
                                <Home size={16} color="#00c853" />
                              )}
                            </div>
                          </div>

                          <div style={styles.stakedNftDetails}>
                            <div style={styles.stakedNftRow}>
                              <span style={styles.stakedNftLabel}>Stake Date:</span>
                              <span style={styles.stakedNftValue}>{formatDate(nft.stakeTime)}</span>
                            </div>
                            <div style={styles.stakedNftRow}>
                              <span style={styles.stakedNftLabel}>Unlock Date:</span>
                              <span style={styles.stakedNftValue}>{formatDate(nft.unlockTime)}</span>
                            </div>
                            <div style={styles.stakedNftRow}>
                              <span style={styles.stakedNftLabel}>Lock Duration:</span>
                              <span style={styles.stakedNftValue}>
                                {nft.lockDuration / 86400} days (
                                {LOCK_DURATIONS.find((d) => d.days === nft.lockDuration / 86400)?.label})
                              </span>
                            </div>
                            <div style={styles.stakedNftRow}>
                              <span style={styles.stakedNftLabel}>NFT Value:</span>
                              <span style={styles.stakedNftValue}>${nft.value.toLocaleString()}</span>
                            </div>
                            <div style={styles.stakedNftRow}>
                              <span style={styles.stakedNftLabel}>AED LST Reward:</span>
                              <span style={styles.stakedNftReward}>
                                {convertUSDtoAED(nft.reward).toLocaleString()} AED LST
                              </span>
                            </div>
                          </div>

                          <div style={styles.stakedNftProgress}>
                            <div
                              style={{
                                ...styles.stakedNftProgressBar,
                                ...(nft.type === "tbond" ? styles.tbondProgressBar : styles.propertyDeedProgressBar),
                                width: `${progress}%`,
                              }}
                            ></div>
                          </div>

                          <div style={styles.stakedNftRow}>
                            <span style={styles.stakedNftLabel}>
                              {isUnlocked ? "Unlocked" : `${progress}% Complete`}
                            </span>
                            <span style={styles.stakedNftValue}>
                              {isUnlocked
                                ? "Ready to unstake"
                                : `${Math.ceil((nft.unlockTime - now) / 86400)} days remaining`}
                            </span>
                          </div>

                          <div style={styles.stakedNftActions}>
                            <button
                              style={styles.stakedNftButton}
                              onClick={() => unstakeNFT(nft)}
                              disabled={isProcessing || !isUnlocked}
                              onMouseEnter={(e) => {
                                if (!isProcessing && isUnlocked) {
                                  e.currentTarget.style.backgroundColor = styles.stakedNftButtonHover.backgroundColor
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isProcessing && isUnlocked) {
                                  e.currentTarget.style.backgroundColor = "transparent"
                                }
                              }}
                            >
                              {isUnlocked ? "Unstake" : "Locked"}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyStateMessage}>You don't have any staked NFTs</p>
                    <p style={styles.emptyStateSubMessage}>
                      Stake your T-Bonds or Property Deeds to earn AED LST tokens
                    </p>
                  </div>
                )}

                {statusMessage.type && (
                  <div
                    style={{
                      color:
                        statusMessage.type === "error"
                          ? "#ff4d4f"
                          : statusMessage.type === "success"
                            ? "#52c41a"
                            : statusMessage.type === "info"
                              ? "#1890ff"
                              : "#ff6b00",
                      marginTop: "1rem",
                    }}
                  >
                    {statusMessage.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

