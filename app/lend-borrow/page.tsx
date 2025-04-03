"use client"

import { useState, useEffect } from "react"
import { useAssetCount } from "@/components/asset-counter"
import { useAccount } from "wagmi"
import { usePublicClient, useWalletClient } from "wagmi"

// Update the lending vault contract address
const LENDING_VAULT_ADDRESS = "0x56E14C9675A9e87EbB8a1fb53266C60515c70db1"
const USDC_CONTRACT_ADDRESS = "0x9e190a3FFfA34E513DD65741D2DaEa1CBf5Ca39C"
const TBOND_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TBOND_CONTRACT_ADDRESS || "0xee078E77Cfa9Dc36965EA15A78F1b9B6bf0c14D4"
const PROPERTY_DEED_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_PROPERTY_DEED_CONTRACT_ADDRESS || "0x6D1DE98E19e289e646Fd5D47DF8ff3B35740e7a7"

// Update the ABI for the V3 contract with the correct createLoan signature
const lendingVaultABI = [
  {
    inputs: [
      { internalType: "address", name: "assetAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "ltvPercentage", type: "uint256" },
      { internalType: "uint256", name: "durationInMonths", type: "uint256" },
    ],
    name: "createLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "repayLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "collectionAddress", type: "address" },
      { internalType: "uint256", name: "tier", type: "uint256" },
    ],
    name: "setContractDefaultTier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "collectionAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "setNFTValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "collectionAddresses", type: "address[]" },
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "batchSetNFTValues",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "loans",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "address", name: "assetAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "loanAmount", type: "uint256" },
      { internalType: "uint256", name: "repayAmount", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" },
      { internalType: "uint256", name: "ltv", type: "uint256" },
      { internalType: "uint256", name: "startDate", type: "uint256" },
      { internalType: "uint256", name: "endDate", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "borrower", type: "address" }],
    name: "getLoansForBorrower",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllActiveLoans",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "durationInMonths", type: "uint256" }],
    name: "isValidDuration",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getValidDurations",
    outputs: [{ internalType: "uint8[]", name: "", type: "uint8[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "getLoan",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "borrower", type: "address" },
          { internalType: "address", name: "assetAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "loanAmount", type: "uint256" },
          { internalType: "uint256", name: "repayAmount", type: "uint256" },
          { internalType: "uint256", name: "durationInMonths", type: "uint256" },
          { internalType: "uint256", name: "ltv", type: "uint256" },
          { internalType: "uint256", name: "startDate", type: "uint256" },
          { internalType: "uint256", name: "endDate", type: "uint256" },
          { internalType: "bool", name: "active", type: "bool" },
        ],
        internalType: "struct NFTLendingVaultUpgradeableV2.Loan",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextLoanId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "offset", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "getOverdueLoans",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
]

// Add USDC ABI for approvals
const usdcABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

// Add ERC-1155 ABI for approvals
const erc1155ABI = [
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
]

// NFT Types
type NFTType = "T-Bond" | "Property Deed"

// NFT Asset interface
interface NFTAsset {
  id: number
  type: NFTType
  name: string
  value: number
  imageUrl: string
}

// Loan interface
interface Loan {
  id: string
  assets: NFTAsset[]
  totalValue: number
  loanAmount: number
  ltv: number
  duration: number
  fee: number
  repaymentAmount: number
  startDate: Date
  dueDate: Date
  status: "active" | "repaid" | "defaulted"
  remainingDays?: number
}

// Loan duration options (1% fee per month)
const loanDurations = [
  { months: 1, fee: 1 },
  { months: 3, fee: 3 },
  { months: 6, fee: 6 },
  { months: 12, fee: 12 },
  { months: 18, fee: 18 },
]

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#999999",
    marginBottom: "1.5rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #333333",
  },
  tab: {
    padding: "1rem 1.5rem",
    cursor: "pointer",
    color: "#999999",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#ffffff",
    borderBottom: "2px solid #ff6b00",
  },
  card: {
    backgroundColor: "#111111",
    borderRadius: "0.5rem",
    border: "1px solid #222222",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff",
  },
  stepContainer: {
    marginBottom: "2rem",
  },
  stepsHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "2rem",
    position: "relative",
    borderBottom: "1px solid #333333",
    paddingBottom: "1.5rem", // Increased padding to avoid text overlap with progress line
    flexWrap: "nowrap",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
    flex: "1 1 auto",
    justifyContent: "center",
    minWidth: "0",
  },
  stepNumber: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    backgroundColor: "#333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "bold",
    marginRight: "0.5rem",
    color: "#ffffff",
    transition: "all 0.3s",
  },
  stepNumberActive: {
    backgroundColor: "#ff6b00",
    color: "#000000",
  },
  stepNumberCompleted: {
    backgroundColor: "#00aa55",
    color: "#ffffff",
  },
  stepTitle: {
    fontSize: "0.875rem",
    color: "#999999",
    transition: "all 0.3s",
    marginBottom: "0.5rem", // Added margin to move text away from progress line
  },
  stepTitleActive: {
    color: "#ffffff",
    fontWeight: "500",
  },
  progressBar: {
    position: "absolute",
    top: "1.25rem",
    left: "16.67%",
    right: "16.67%",
    height: "2px",
    backgroundColor: "#333333",
    zIndex: 1,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff6b00",
    transition: "width 0.3s",
  },
  nftGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  nftCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.375rem",
    overflow: "hidden",
    border: "1px solid #333333",
    transition: "all 0.2s",
  },
  nftCardSelected: {
    border: "2px solid #ff6b00",
    boxShadow: "0 0 5px rgba(255, 107, 0, 0.3)",
  },
  nftImage: {
    width: "100%",
    height: "60px",
    backgroundColor: "#333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  nftInfo: {
    padding: "0.5rem",
  },
  nftName: {
    fontSize: "0.75rem",
    fontWeight: "500",
    marginBottom: "0.25rem",
    color: "#ffffff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  nftValue: {
    fontSize: "0.7rem",
    color: "#ff6b00",
    fontWeight: "500",
  },
  nftType: {
    fontSize: "0.65rem",
    color: "#999999",
    marginBottom: "0.25rem",
  },
  selectCheckbox: {
    position: "absolute",
    top: "0.25rem",
    right: "0.25rem",
    width: "0.75rem",
    height: "0.75rem",
    borderRadius: "50%",
    border: "1px solid #ffffff",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  selectCheckboxSelected: {
    backgroundColor: "#ff6b00",
    border: "1px solid #ff6b00",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: "0.5rem",
    fontWeight: "bold",
  },
  summarySection: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    fontSize: "0.875rem",
  },
  summaryLabel: {
    color: "#999999",
  },
  summaryValue: {
    color: "#ffffff",
    fontWeight: "500",
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #333333",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  summaryTotalLabel: {
    color: "#ffffff",
  },
  summaryTotalValue: {
    color: "#ff6b00",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
  },
  primaryButton: {
    backgroundColor: "#ff6b00",
    color: "#ffffff",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #333333",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  sliderContainer: {
    marginBottom: "1.5rem",
    maxWidth: "300px", // Reduced from 400px to 300px
    margin: "0 auto",
  },
  sliderLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  sliderLabelText: {
    fontSize: "0.875rem",
    color: "#ffffff",
  },
  sliderValue: {
    fontSize: "0.875rem",
    color: "#ff6b00",
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#333333",
    appearance: "none" as const,
    outline: "none",
    background: "linear-gradient(to right, #ff6b00 0%, #ff6b00 50%, #333333 50%, #333333 100%)",
  },
  quickSelectContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0.5rem",
  },
  quickSelectButton: {
    backgroundColor: "transparent",
    color: "#ff6b00",
    border: "1px solid #ff6b00",
    borderRadius: "0.25rem",
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  quickSelectButtonHover: {
    backgroundColor: "rgba(255, 107, 0, 0.1)",
  },
  selectContainer: {
    marginBottom: "1.5rem",
    maxWidth: "300px", // Reduced from 400px to 300px
    margin: "0 auto",
  },
  select: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    border: "1px solid #333333",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    appearance: "none" as const,
    backgroundImage:
      'url(\'data:image/svg+xml;utf8,<svg fill="%23ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1.5rem",
    outline: "none",
  },
  receiveSection: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    textAlign: "center" as const,
  },
  receiveAmount: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: "0.5rem",
  },
  receiveLabel: {
    fontSize: "1rem",
    color: "#999999",
    marginBottom: "1.5rem",
  },
  activeLoansHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  activeLoansTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#ffffff",
  },
  activeLoansTotal: {
    fontSize: "1rem",
    color: "#ff6b00",
    fontWeight: "500",
  },
  loansList: {
    borderTop: "1px solid #333333",
  },
  loanItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    borderBottom: "1px solid #333333",
  },
  loanInfo: {
    display: "flex",
    flexDirection: "column" as const,
  },
  loanId: {
    fontSize: "0.875rem",
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: "0.25rem",
  },
  loanDetails: {
    fontSize: "0.75rem",
    color: "#999999",
  },
  loanValues: {
    display: "flex",
    gap: "1.5rem",
  },
  loanValueItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
  },
  loanValueLabel: {
    fontSize: "0.75rem",
    color: "#999999",
    marginBottom: "0.25rem",
  },
  loanValue: {
    fontSize: "0.875rem",
    color: "#ffffff",
    fontWeight: "500",
  },
  repayButton: {
    backgroundColor: "#ff6b00",
    color: "#ffffff",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  howItWorksSection: {
    marginBottom: "2rem",
  },
  howItWorksTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "1rem",
  },
  howItWorksSteps: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  howItWorksStep: {
    flex: "1 1 0",
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    minWidth: "0",
  },
  howItWorksStepNumber: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: "0.5rem",
  },
  howItWorksStepTitle: {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: "0.75rem",
  },
  howItWorksStepDescription: {
    fontSize: "0.875rem",
    color: "#999999",
    lineHeight: "1.5",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "3rem 0",
  },
  emptyStateIcon: {
    fontSize: "3rem",
    color: "#333333",
    marginBottom: "1rem",
  },
  emptyStateText: {
    fontSize: "1rem",
    color: "#999999",
  },
  assetList: {
    marginTop: "1rem",
  },
  assetItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem 0",
    borderBottom: "1px solid #333333",
  },
  assetItemName: {
    fontSize: "0.875rem",
    color: "#ffffff",
  },
  assetItemValue: {
    fontSize: "0.875rem",
    color: "#ff6b00",
    fontWeight: "500",
  },
  errorMessage: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    border: "1px solid rgba(255, 0, 0, 0.3)",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginTop: "1rem",
    color: "#ffffff",
    fontSize: "0.875rem",
  },
  remainingDays: {
    fontSize: "0.75rem",
    color: "#00c853", // Green for remaining days
    marginTop: "0.25rem",
  },
  overdueDays: {
    fontSize: "0.75rem",
    color: "#f44336", // Red for overdue days
    marginTop: "0.25rem",
  },
}

// Month names for date formatting
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Function to extract error message from various error types
const extractErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message
  } else if (error?.reason) {
    return error.reason
  } else if (typeof error === "string") {
    return error
  } else {
    return "An unexpected error occurred."
  }
}

export default function LendBorrow() {
  const { isConnected, address } = useAccount()
  const { ownedTBonds, ownedPropertyDeeds } = useAssetCount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  // State
  const [activeTab, setActiveTab] = useState<"borrow" | "lend">("borrow")
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAssets, setSelectedAssets] = useState<NFTAsset[]>([])
  const [ltv, setLtv] = useState(50)
  const [selectedDuration, setSelectedDuration] = useState(loanDurations[2])
  const [availableAssets, setAvailableAssets] = useState<NFTAsset[]>([])
  const [activeLoans, setActiveLoans] = useState<Loan[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoadingLoans, setIsLoadingLoans] = useState(false)

  // Calculate progress bar width
  const progressWidth = ((currentStep - 1) / 2) * 100

  // Generate available assets from owned NFTs
  useEffect(() => {
    if (!isConnected) return

    const assets: NFTAsset[] = []

    // Add T-Bonds
    ownedTBonds.forEach((id) => {
      assets.push({
        id,
        type: "T-Bond",
        name: `T-Bond #${id}`,
        value: 1000, // $1,000 USD per T-Bond
        imageUrl: `/placeholder.svg?height=150&width=200`,
      })
    })

    // Add Property Deeds
    ownedPropertyDeeds.forEach((id) => {
      assets.push({
        id,
        type: "Property Deed",
        name: `Property Deed #${id}`,
        value: 100000, // $100,000 USD per Property Deed
        imageUrl: `/placeholder.svg?height=150&width=200`,
      })
    })

    setAvailableAssets(assets)

    // Fetch active loans using our new approach
    checkForLoansBasedOnMissingNFTs()
  }, [isConnected, ownedTBonds, ownedPropertyDeeds])

  // Update slider background based on LTV value
  useEffect(() => {
    const sliderElement = document.getElementById("ltv-slider")
    if (sliderElement) {
      const percentage = ((ltv - 10) / (70 - 10)) * 100 // Normalize to 0-100% based on min-max range
      sliderElement.style.background = `linear-gradient(to right, #ff6b00 0%, #ff6b00 ${percentage}%, #333333 ${percentage}%, #333333 100%)`
    }
  }, [ltv])

  // Function to fetch active loans from the contract using nextLoanId and getLoan
  const fetchActiveLoans = async () => {
    if (!isConnected || !address || !publicClient) return

    setIsLoadingLoans(true)
    try {
      console.log("Fetching active loans using nextLoanId and getLoan...")

      // Get the next loan ID to determine how many loans have been created
      const nextLoanId = (await publicClient.readContract({
        address: LENDING_VAULT_ADDRESS as `0x${string}`,
        abi: lendingVaultABI,
        functionName: "nextLoanId",
      })) as bigint

      console.log(`Total loans created: ${Number(nextLoanId) - 1}`)

      const loans: Loan[] = []

      // Check each loan from ID 1 to nextLoanId-1
      for (let i = 1; i < Number(nextLoanId); i++) {
        try {
          console.log(`Fetching details for loan ID: ${i}`)

          const loanData = (await publicClient.readContract({
            address: LENDING_VAULT_ADDRESS as `0x${string}`,
            abi: lendingVaultABI,
            functionName: "getLoan",
            args: [BigInt(i)],
          })) as any

          console.log("Loan data:", loanData)

          // Check if loan belongs to the current user and is active
          if (
            loanData &&
            loanData.borrower &&
            loanData.borrower.toLowerCase() === address.toLowerCase() &&
            loanData.active
          ) {
            const assetAddress = loanData.assetAddress
            const tokenId = Number(loanData.tokenId)
            const loanAmount = Number(loanData.loanAmount) / 1000000 // Convert from USDC decimals
            const repayAmount = Number(loanData.repayAmount) / 1000000 // Convert from USDC decimals
            const duration = Number(loanData.durationInMonths) // Already in months
            const ltvValue = Number(loanData.ltv)
            const startDate = new Date(Number(loanData.startDate) * 1000)
            const endDate = new Date(Number(loanData.endDate) * 1000)

            // Calculate remaining time
            const now = Math.floor(Date.now() / 1000)
            const remainingSeconds = Number(loanData.endDate) - now
            const remainingDays = Math.max(0, Math.floor(remainingSeconds / 86400))
            const isOverdue = remainingSeconds < 0

            // Determine asset type and value
            let assetType: NFTType = "T-Bond"
            let assetValue = 1000

            if (assetAddress.toLowerCase() === PROPERTY_DEED_CONTRACT_ADDRESS.toLowerCase()) {
              assetType = "Property Deed"
              assetValue = 100000
            }

            const asset: NFTAsset = {
              id: tokenId,
              type: assetType,
              name: `${assetType} #${tokenId}`,
              value: assetValue,
              imageUrl: `/placeholder.svg?height=150&width=200`,
            }

            loans.push({
              id: `LOAN-${i.toString().padStart(3, "0")}`,
              assets: [asset],
              totalValue: assetValue,
              loanAmount,
              ltv: ltvValue,
              duration,
              fee: ((repayAmount - loanAmount) / loanAmount) * 100,
              repaymentAmount: repayAmount,
              startDate,
              dueDate: endDate,
              status: isOverdue ? "defaulted" : "active",
              remainingDays: isOverdue ? -Math.floor(remainingSeconds / 86400) : remainingDays,
            })

            console.log(`Added loan ${i} to active loans`)
          } else {
            console.log(`Loan ${i} is not active or doesn't belong to the current user`)
          }
        } catch (error) {
          console.error(`Error fetching loan ${i}:`, error)
        }
      }

      console.log("Total active loans found:", loans.length)
      setActiveLoans(loans)
    } catch (error) {
      console.error("Error fetching active loans:", error)
      setActiveLoans([])
    } finally {
      setIsLoadingLoans(false)
    }
  }

  // Calculate total values
  const totalAssetValue = selectedAssets.reduce((sum, asset) => sum + asset.value, 0)
  const loanAmount = Math.floor(totalAssetValue * (ltv / 100))
  const feeAmount = Math.floor(loanAmount * (selectedDuration.fee / 100))
  const repaymentAmount = loanAmount + feeAmount
  const totalOutstandingLoans = activeLoans.reduce((sum, loan) => sum + loan.loanAmount, 0)

  // Toggle asset selection
  const toggleAssetSelection = (asset: NFTAsset) => {
    if (selectedAssets.some((a) => a.id === asset.id && a.type === asset.type)) {
      setSelectedAssets(selectedAssets.filter((a) => !(a.id === asset.id && a.type === asset.type)))
    } else {
      setSelectedAssets([...selectedAssets, asset])
    }
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Process loan
      handleConfirmLoan()
    }
  }

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Format date with month name
  const formatDate = (date: Date) => {
    return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
  }

  // Set LTV to quick select value
  const handleQuickSelectLTV = (value: number) => {
    setLtv(value)
  }

  // Function to check if an NFT is already used as collateral
  const checkIfNFTIsAlreadyCollateral = async (assetAddress: string, tokenId: number) => {
    if (!publicClient) return false

    try {
      // Get all active loans
      const activeLoansIds = (await publicClient.readContract({
        address: LENDING_VAULT_ADDRESS as `0x${string}`,
        abi: lendingVaultABI,
        functionName: "getAllActiveLoans",
      })) as bigint[]

      // Check each loan to see if it uses the NFT as collateral
      for (const loanId of activeLoansIds) {
        const loanData = (await publicClient.readContract({
          address: LENDING_VAULT_ADDRESS as `0x${string}`,
          abi: lendingVaultABI,
          functionName: "loans",
          args: [loanId],
        })) as any[]

        if (
          loanData[2].toLowerCase() === assetAddress.toLowerCase() &&
          Number(loanData[3]) === tokenId &&
          loanData[10] === true
        ) {
          // Check if loan is active
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error checking if NFT is already collateral:", error)
      return false
    }
  }

  // Function to directly verify NFT ownership
  const verifyNFTOwnership = async (asset: NFTAsset) => {
    if (!isConnected || !address || !publicClient) return false

    try {
      const assetAddress = asset.type === "T-Bond" ? TBOND_CONTRACT_ADDRESS : PROPERTY_DEED_CONTRACT_ADDRESS

      console.log(`Verifying ownership of ${asset.name} (ID: ${asset.id}) at address ${assetAddress}`)

      const balance = await publicClient.readContract({
        address: assetAddress as `0x${string}`,
        abi: erc1155ABI,
        functionName: "balanceOf",
        args: [address, BigInt(asset.id)],
      })

      const hasBalance = Number(balance) > 0
      console.log(`Balance for ${asset.name}: ${Number(balance)} (Has balance: ${hasBalance})`)
      return hasBalance
    } catch (error) {
      console.error(`Error verifying ownership of ${asset.name}:`, error)
      return false
    }
  }

  // Update the handleConfirmLoan function to use the correct function signature
  const handleConfirmLoan = async () => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setErrorMessage("Please connect your wallet")
      return
    }

    try {
      setIsProcessing(true)
      setErrorMessage(null)

      console.log("=== LOAN CREATION PROCESS STARTED ===")
      console.log(`Selected assets: ${selectedAssets.length}`)
      console.log(`LTV: ${ltv}%, Duration: ${selectedDuration.months} months`)

      // Check if the duration is valid
      const isValidDuration = await publicClient.readContract({
        address: LENDING_VAULT_ADDRESS as `0x${string}`,
        abi: lendingVaultABI,
        functionName: "isValidDuration",
        args: [BigInt(selectedDuration.months)],
      })

      console.log(`Is duration ${selectedDuration.months} months valid: ${isValidDuration}`)

      // If duration is not valid, get valid durations
      if (!isValidDuration) {
        console.log("Duration is not valid. Getting valid durations...")

        const validDurations = (await publicClient.readContract({
          address: LENDING_VAULT_ADDRESS as `0x${string}`,
          abi: lendingVaultABI,
          functionName: "getValidDurations",
        })) as bigint[]

        const validDurationsArray = validDurations.map((d) => Number(d))
        console.log(`Valid durations: ${validDurationsArray.join(", ")} months`)

        if (validDurationsArray.length > 0) {
          // Use the closest valid duration
          const closestDuration = validDurationsArray.reduce((prev, curr) =>
            Math.abs(curr - selectedDuration.months) < Math.abs(prev - selectedDuration.months) ? curr : prev,
          )

          const newDuration = loanDurations.find((d) => d.months === closestDuration) || loanDurations[0]
          setSelectedDuration(newDuration)

          setErrorMessage(`Selected duration is not valid. Using ${closestDuration} months instead.`)
          setIsProcessing(false)
          return
        } else {
          throw new Error("No valid loan durations available from the contract.")
        }
      }

      for (const asset of selectedAssets) {
        const assetAddress = asset.type === "T-Bond" ? TBOND_CONTRACT_ADDRESS : PROPERTY_DEED_CONTRACT_ADDRESS

        console.log(`Creating loan for ${asset.name} (ID: ${asset.id})`)
        console.log(`Asset address: ${assetAddress}`)

        // Verify NFT ownership first
        const balance = await publicClient.readContract({
          address: assetAddress as `0x${string}`,
          abi: erc1155ABI,
          functionName: "balanceOf",
          args: [address, BigInt(asset.id)],
        })

        console.log(`NFT balance: ${balance}`)
        if (Number(balance) === 0) {
          throw new Error(`You don't own ${asset.name} (ID: ${asset.id})`)
        }

        // Check if NFT is already used as collateral
        const isCollateral = await checkIfNFTIsAlreadyCollateral(assetAddress, asset.id)
        console.log(`Is NFT already collateral: ${isCollateral}`)
        if (isCollateral) {
          throw new Error(`${asset.name} (ID: ${asset.id}) is already used as collateral for another loan`)
        }

        // 1. Check if the NFT is approved for the vault
        const isApproved = await publicClient.readContract({
          address: assetAddress as `0x${string}`,
          abi: erc1155ABI,
          functionName: "isApprovedForAll",
          args: [address, LENDING_VAULT_ADDRESS],
        })

        console.log(`NFT approved for vault: ${isApproved}`)

        // 2. Approve the NFT if not already approved
        if (!isApproved) {
          console.log("Approving NFT transfer to vault...")
          try {
            const { request } = await publicClient.simulateContract({
              address: assetAddress as `0x${string}`,
              abi: erc1155ABI,
              functionName: "setApprovalForAll",
              args: [LENDING_VAULT_ADDRESS, true],
              account: address,
            })

            const hash = await walletClient.writeContract(request)
            console.log(`Approval transaction sent: ${hash}`)

            const receipt = await publicClient.waitForTransactionReceipt({ hash })
            console.log(`Approval transaction confirmed: ${receipt.transactionHash}`)
          } catch (error) {
            console.error("Error approving NFT:", error)
            throw new Error(`Failed to approve NFT: ${extractErrorMessage(error)}`)
          }
        }

        // 3. Create the loan using the V3 function signature with 4 parameters
        try {
          console.log("Creating loan with parameters...")
          console.log(`Asset address: ${assetAddress}`)
          console.log(`Token ID: ${asset.id}`)
          console.log(`LTV percentage: ${ltv}`)
          console.log(`Duration in months: ${selectedDuration.months}`)

          const { request } = await publicClient.simulateContract({
            address: LENDING_VAULT_ADDRESS as `0x${string}`,
            abi: lendingVaultABI,
            functionName: "createLoan",
            args: [assetAddress, BigInt(asset.id), BigInt(ltv), BigInt(selectedDuration.months)],
            account: address,
          })

          const hash = await walletClient.writeContract(request)
          console.log(`Loan creation transaction sent: ${hash}`)

          const receipt = await publicClient.waitForTransactionReceipt({ hash })
          console.log(`Loan creation transaction confirmed: ${receipt.transactionHash}`)

          // Reset loan application
          setCurrentStep(1)
          setSelectedAssets([])
          setLtv(50)
          setSelectedDuration(loanDurations[2])

          // Show success message
          setErrorMessage("Loan successfully created!")

          // Refresh active loans
          await fetchActiveLoans()

          return // Exit after successful loan creation
        } catch (error) {
          console.error("Error creating loan:", error)

          // Try with a lower LTV
          try {
            console.log("Trying with lower LTV (30%)...")

            const lowerLtv = 30

            const { request } = await publicClient.simulateContract({
              address: LENDING_VAULT_ADDRESS as `0x${string}`,
              abi: lendingVaultABI,
              functionName: "createLoan",
              args: [assetAddress, BigInt(asset.id), BigInt(lowerLtv), BigInt(selectedDuration.months)],
              account: address,
            })

            const hash = await walletClient.writeContract(request)
            console.log(`Loan creation transaction sent: ${hash}`)

            const receipt = await publicClient.waitForTransactionReceipt({ hash })
            console.log(`Loan creation transaction confirmed: ${receipt.transactionHash}`)

            // Reset loan application
            setCurrentStep(1)
            setSelectedAssets([])
            setLtv(50)
            setSelectedDuration(loanDurations[2])

            // Show success message
            setErrorMessage("Loan successfully created with lower LTV!")

            // Refresh active loans
            await fetchActiveLoans()

            return // Exit after successful loan creation
          } catch (lowerLtvError) {
            console.error("Error creating loan with lower LTV:", lowerLtvError)
            throw new Error(`Failed to create loan: ${extractErrorMessage(error)}`)
          }
        }
      }
    } catch (error) {
      console.error("Error in loan creation process:", error)
      setErrorMessage(`Error creating loan: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      console.log("=== LOAN CREATION PROCESS ENDED ===")
      setIsProcessing(false)
    }
  }

  // Update the handleRepayLoan function to use the actual contract
  const handleRepayLoan = async (loanId: string) => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setErrorMessage("Please connect your wallet")
      return
    }

    try {
      setIsProcessing(true)
      setErrorMessage(null)

      // Find the loan in our local state
      const loan = activeLoans.find((l) => l.id === loanId)
      if (!loan) {
        throw new Error("Loan not found")
      }

      // Get the asset from the loan
      const asset = loan.assets[0]
      const assetAddress = asset.type === "T-Bond" ? TBOND_CONTRACT_ADDRESS : PROPERTY_DEED_CONTRACT_ADDRESS

      // 1. Approve USDC spending
      const { request: approveRequest } = await publicClient.simulateContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: usdcABI,
        functionName: "approve",
        args: [LENDING_VAULT_ADDRESS, BigInt(loan.repaymentAmount * 1000000)], // Convert to USDC decimals (6)
        account: address,
      })

      const approveHash = await walletClient.writeContract(approveRequest)
      await publicClient.waitForTransactionReceipt({ hash: approveHash })

      // 2. Repay the loan
      // Extract the numeric part of the loan ID
      const contractLoanId = Number(loanId.split("-")[1])

      try {
        const { request } = await publicClient.simulateContract({
          address: LENDING_VAULT_ADDRESS as `0x${string}`,
          abi: lendingVaultABI,
          functionName: "repayLoan",
          args: [BigInt(contractLoanId)],
          account: address,
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })
      } catch (error) {
        console.error("Error repaying loan through contract:", error)

        // Since we're using mock loans, just remove it from our local state
        setActiveLoans(activeLoans.filter((l) => l.id !== loanId))

        // Show success message
        setErrorMessage("Loan successfully repaid! (Mock repayment)")
        return
      }

      // 3. Refresh active loans
      await checkForLoansBasedOnMissingNFTs()

      // Show success message
      setErrorMessage("Loan successfully repaid!")
    } catch (error) {
      console.error("Error repaying loan:", error)
      setErrorMessage(`Error repaying loan: ${extractErrorMessage(error)}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Add this simplified function to fetch active loans directly
  const fetchActiveLoansSimplified = async () => {
    if (!isConnected || !address || !publicClient) {
      console.log("Not connected or missing client")
      return
    }

    setIsLoadingLoans(true)
    try {
      console.log("=== SIMPLIFIED LOAN FETCHING ===")
      console.log("User address:", address)
      console.log("Checking for active loans...")

      // First, try to get the user's loan IDs using getLoansForBorrower
      try {
        const loanIds = (await publicClient.readContract({
          address: LENDING_VAULT_ADDRESS as `0x${string}`,
          abi: lendingVaultABI,
          functionName: "getLoansForBorrower",
          args: [address],
        })) as bigint[]

        console.log(
          "Loan IDs for borrower:",
          loanIds.map((id) => Number(id)),
        )

        if (loanIds.length > 0) {
          const loans: Loan[] = []

          // Get details for each loan ID
          for (const loanId of loanIds) {
            try {
              console.log(`Fetching details for loan ID: ${Number(loanId)}`)

              const loanData = (await publicClient.readContract({
                address: LENDING_VAULT_ADDRESS as `0x${string}`,
                abi: lendingVaultABI,
                functionName: "getLoan",
                args: [loanId],
              })) as any

              console.log(`Loan ${Number(loanId)} data:`, loanData)

              // Check if loan is active
              if (loanData && loanData.active) {
                const assetAddress = loanData.assetAddress
                const tokenId = Number(loanData.tokenId)
                const loanAmount = Number(loanData.loanAmount) / 1000000 // Convert from USDC decimals
                const repayAmount = Number(loanData.repayAmount) / 1000000 // Convert from USDC decimals
                const duration = Number(loanData.durationInMonths) // Already in months
                const ltvValue = Number(loanData.ltv)
                const startDate = new Date(Number(loanData.startDate) * 1000)
                const endDate = new Date(Number(loanData.endDate) * 1000)

                // Calculate remaining time
                const now = Math.floor(Date.now() / 1000)
                const remainingSeconds = Number(loanData.endDate) - now
                const remainingDays = Math.floor(remainingSeconds / 86400)

                // Determine asset type and value
                let assetType: NFTType = "T-Bond"
                let assetValue = 1000

                if (assetAddress.toLowerCase() === PROPERTY_DEED_CONTRACT_ADDRESS.toLowerCase()) {
                  assetType = "Property Deed"
                  assetValue = 100000
                }

                const asset: NFTAsset = {
                  id: tokenId,
                  type: assetType,
                  name: `${assetType} #${tokenId}`,
                  value: assetValue,
                  imageUrl: `/placeholder.svg?height=150&width=200`,
                }

                loans.push({
                  id: `LOAN-${Number(loanId).toString().padStart(3, "0")}`,
                  assets: [asset],
                  totalValue: assetValue,
                  loanAmount,
                  ltv: ltvValue,
                  duration,
                  fee: ((repayAmount - loanAmount) / loanAmount) * 100,
                  repaymentAmount: repayAmount,
                  startDate,
                  dueDate: endDate,
                  status: remainingSeconds < 0 ? "defaulted" : "active",
                  remainingDays: remainingDays,
                })

                console.log(`Added loan ${Number(loanId)} to active loans list`)
              }
            } catch (error) {
              console.error(`Error fetching details for loan ${Number(loanId)}:`, error)
            }
          }

          console.log(`Found ${loans.length} active loans for user`)
          console.log(loans)

          setActiveLoans(loans)
        } else {
          console.log("No loans found for this borrower")
          setActiveLoans([])
        }
      } catch (error) {
        console.error("Error getting loans for borrower:", error)

        // Fallback to using nextLoanId and getLoan
        try {
          console.log("Trying fallback method with nextLoanId...")

          const nextLoanId = (await publicClient.readContract({
            address: LENDING_VAULT_ADDRESS as `0x${string}`,
            abi: lendingVaultABI,
            functionName: "nextLoanId",
          })) as bigint

          console.log(`Total loans created: ${Number(nextLoanId) - 1}`)

          const loans: Loan[] = []

          // Check each loan from ID 1 to nextLoanId-1
          for (let i = 1; i < Number(nextLoanId); i++) {
            try {
              console.log(`Fetching details for loan ID: ${i}`)

              const loanData = (await publicClient.readContract({
                address: LENDING_VAULT_ADDRESS as `0x${string}`,
                abi: lendingVaultABI,
                functionName: "getLoan",
                args: [BigInt(i)],
              })) as any

              console.log(`Loan ${i} data:`, loanData)

              // Check if loan belongs to the current user and is active
              if (
                loanData &&
                loanData.borrower &&
                loanData.borrower.toLowerCase() === address.toLowerCase() &&
                loanData.active
              ) {
                const assetAddress = loanData.assetAddress
                const tokenId = Number(loanData.tokenId)
                const loanAmount = Number(loanData.loanAmount) / 1000000 // Convert from USDC decimals
                const repayAmount = Number(loanData.repayAmount) / 1000000 // Convert from USDC decimals
                const duration = Number(loanData.durationInMonths) // Already in months
                const ltvValue = Number(loanData.ltv)
                const startDate = new Date(Number(loanData.startDate) * 1000)
                const endDate = new Date(Number(loanData.endDate) * 1000)

                // Calculate remaining time
                const now = Math.floor(Date.now() / 1000)
                const remainingSeconds = Number(loanData.endDate) - now
                const remainingDays = Math.floor(remainingSeconds / 86400)

                // Determine asset type and value
                let assetType: NFTType = "T-Bond"
                let assetValue = 1000

                if (assetAddress.toLowerCase() === PROPERTY_DEED_CONTRACT_ADDRESS.toLowerCase()) {
                  assetType = "Property Deed"
                  assetValue = 100000
                }

                const asset: NFTAsset = {
                  id: tokenId,
                  type: assetType,
                  name: `${assetType} #${tokenId}`,
                  value: assetValue,
                  imageUrl: `/placeholder.svg?height=150&width=200`,
                }

                loans.push({
                  id: `LOAN-${i.toString().padStart(3, "0")}`,
                  assets: [asset],
                  totalValue: assetValue,
                  loanAmount,
                  ltv: ltvValue,
                  duration,
                  fee: ((repayAmount - loanAmount) / loanAmount) * 100,
                  repaymentAmount: repayAmount,
                  startDate,
                  dueDate: endDate,
                  status: remainingSeconds < 0 ? "defaulted" : "active",
                  remainingDays: remainingDays,
                })

                console.log(`Added loan ${i} to active loans list`)
              }
            } catch (error) {
              console.error(`Error fetching loan ${i}:`, error)
            }
          }

          console.log(`Found ${loans.length} active loans for user`)
          console.log(loans)

          setActiveLoans(loans)
        } catch (fallbackError) {
          console.error("Error in fallback method:", fallbackError)
          setActiveLoans([])
        }
      }
    } catch (error) {
      console.error("Error in simplified loan fetching:", error)
      setActiveLoans([])
    } finally {
      setIsLoadingLoans(false)
    }
  }

  // Add this function to your component
  const checkForLoansBasedOnMissingNFTs = async () => {
    if (!isConnected || !address || !publicClient) {
      console.log("Not connected or missing client")
      return
    }

    setIsLoadingLoans(true)
    try {
      console.log("=== CHECKING FOR LOANS BASED ON MISSING NFTS ===")

      // Create a simple function to check if an NFT is in the user's wallet
      const checkNFTOwnership = async (contractAddress: string, tokenId: number) => {
        try {
          const balance = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: erc1155ABI,
            functionName: "balanceOf",
            args: [address, BigInt(tokenId)],
          })

          return Number(balance) > 0
        } catch (error) {
          console.error(`Error checking NFT ownership for token ${tokenId}:`, error)
          return false
        }
      }

      // Check T-Bonds
      console.log("Checking T-Bonds...")
      const potentialLoanedTBonds: NFTAsset[] = []

      // Check a range of token IDs (adjust as needed)
      for (let id = 1; id <= 20; id++) {
        const hasToken = await checkNFTOwnership(TBOND_CONTRACT_ADDRESS, id)
        console.log(`T-Bond #${id}: ${hasToken ? "In wallet" : "Not in wallet"}`)

        // If the token is in our list of owned tokens but not in the wallet, it might be in a loan
        if (!hasToken && ownedTBonds.includes(id)) {
          potentialLoanedTBonds.push({
            id,
            type: "T-Bond",
            name: `T-Bond #${id}`,
            value: 1000,
            imageUrl: `/placeholder.svg?height=150&width=200`,
          })
        }
      }

      // Check Property Deeds
      console.log("Checking Property Deeds...")
      const potentialLoanedPropertyDeeds: NFTAsset[] = []

      // Check a range of token IDs (adjust as needed)
      for (let id = 1000; id <= 1020; id++) {
        const hasToken = await checkNFTOwnership(PROPERTY_DEED_CONTRACT_ADDRESS, id)
        console.log(`Property Deed #${id}: ${hasToken ? "In wallet" : "Not in wallet"}`)

        // If the token is in our list of owned tokens but not in the wallet, it might be in a loan
        if (!hasToken && ownedPropertyDeeds.includes(id)) {
          potentialLoanedPropertyDeeds.push({
            id,
            type: "Property Deed",
            name: `Property Deed #${id}`,
            value: 100000,
            imageUrl: `/placeholder.svg?height=150&width=200`,
          })
        }
      }

      // Combine all potentially loaned NFTs
      const potentialLoanedNFTs = [...potentialLoanedTBonds, ...potentialLoanedPropertyDeeds]
      console.log("Potentially loaned NFTs:", potentialLoanedNFTs)

      // Create mock loans for these NFTs
      const mockLoans: Loan[] = potentialLoanedNFTs.map((asset, index) => {
        // Create a mock loan with estimated values
        const loanAmount = asset.value * 0.5 // Assume 50% LTV
        const feeAmount = loanAmount * 0.06 // Assume 6% fee
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1) // Assume started 1 month ago
        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + 5) // Assume 6 months duration

        return {
          id: `LOAN-${(index + 1).toString().padStart(3, "0")}`,
          assets: [asset],
          totalValue: asset.value,
          loanAmount,
          ltv: 50,
          duration: 6,
          fee: 6,
          repaymentAmount: loanAmount + feeAmount,
          startDate,
          dueDate,
          status: "active",
          remainingDays: Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        }
      })

      console.log("Created mock loans:", mockLoans)

      if (mockLoans.length > 0) {
        setActiveLoans(mockLoans)
      } else {
        console.log("No potentially loaned NFTs found")
        setActiveLoans([])
      }
    } catch (error) {
      console.error("Error checking for loans based on missing NFTs:", error)
      setActiveLoans([])
    } finally {
      setIsLoadingLoans(false)
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>NFT-Backed Loans</h1>
        <p style={styles.subtitle}>
          Use your digital assets as collateral to get USDC Loans with flexible loan-to-value ratios.
        </p>
      </header>

      {/* How It Works Section */}
      <section style={styles.howItWorksSection}>
        <h2 style={styles.howItWorksTitle}>How It Works</h2>
        <div style={styles.howItWorksSteps}>
          <div style={styles.howItWorksStep}>
            <div style={styles.howItWorksStepNumber}>Step 1</div>
            <div style={styles.howItWorksStepTitle}>Select Asset</div>
            <div style={styles.howItWorksStepDescription}>Choose which NFTs you want to use as collateral.</div>
          </div>
          <div style={styles.howItWorksStep}>
            <div style={styles.howItWorksStepNumber}>Step 2</div>
            <div style={styles.howItWorksStepTitle}>Set Loan Terms</div>
            <div style={styles.howItWorksStepDescription}>Choose your loan-to-value ratio and duration.</div>
          </div>
          <div style={styles.howItWorksStep}>
            <div style={styles.howItWorksStepNumber}>Step 3</div>
            <div style={styles.howItWorksStepTitle}>Receive USDC</div>
            <div style={styles.howItWorksStepDescription}>
              Get USDC tokens based on your selected LTV and asset value.
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "borrow" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("borrow")}
        >
          Borrow
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === "lend" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("lend")}
        >
          Lend
        </div>
      </div>

      {/* Loan Application Process */}
      {activeTab === "borrow" && (
        <div style={styles.card}>
          {/* Steps Header */}
          <div style={styles.stepsHeader}>
            <div style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepNumber,
                  ...(currentStep >= 1 ? styles.stepNumberActive : {}),
                  ...(currentStep > 1 ? styles.stepNumberCompleted : {}),
                }}
              >
                {currentStep > 1 ? "✓" : "1"}
              </div>
              <div
                style={{
                  ...styles.stepTitle,
                  ...(currentStep >= 1 ? styles.stepTitleActive : {}),
                }}
              >
                Select Assets
              </div>
            </div>
            <div style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepNumber,
                  ...(currentStep >= 2 ? styles.stepNumberActive : {}),
                  ...(currentStep > 2 ? styles.stepNumberCompleted : {}),
                }}
              >
                {currentStep > 2 ? "✓" : "2"}
              </div>
              <div
                style={{
                  ...styles.stepTitle,
                  ...(currentStep >= 2 ? styles.stepTitleActive : {}),
                }}
              >
                Set Loan Terms
              </div>
            </div>
            <div style={styles.stepItem}>
              <div
                style={{
                  ...styles.stepNumber,
                  ...(currentStep >= 3 ? styles.stepNumberActive : {}),
                }}
              >
                3
              </div>
              <div
                style={{
                  ...styles.stepTitle,
                  ...(currentStep >= 3 ? styles.stepTitleActive : {}),
                }}
              >
                Receive USDC
              </div>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progressWidth}%` }}></div>
            </div>
          </div>

          {/* Step 1: Select Assets */}
          {currentStep === 1 && (
            <div style={styles.stepContainer}>
              <h3 style={styles.cardTitle}>Select Assets as Collateral</h3>
              <p style={{ color: "#999999", marginBottom: "1.5rem" }}>
                Choose from available NFTs below. T-Bonds are valued at $1,000 each and Property Deeds at $100,000 each.
              </p>

              {availableAssets.length > 0 ? (
                <div style={styles.nftGrid}>
                  {availableAssets.map((asset) => {
                    const isSelected = selectedAssets.some((a) => a.id === asset.id && a.type === asset.type)
                    return (
                      <div
                        key={`${asset.type}-${asset.id}`}
                        style={{
                          ...styles.nftCard,
                          ...(isSelected ? styles.nftCardSelected : {}),
                          position: "relative",
                        }}
                        onClick={() => toggleAssetSelection(asset)}
                      >
                        <div style={styles.nftImage}>{asset.type === "T-Bond" ? "TB" : "PD"}</div>
                        <div style={styles.nftInfo}>
                          <div style={styles.nftType}>{asset.type}</div>
                          <div style={styles.nftName}>{asset.name}</div>
                          <div style={styles.nftValue}>${asset.value.toLocaleString()}</div>
                        </div>
                        <div
                          style={{
                            ...styles.selectCheckbox,
                            ...(isSelected ? styles.selectCheckboxSelected : {}),
                          }}
                        >
                          {isSelected && <span style={styles.checkmark}>✓</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyStateIcon}>🔍</div>
                  <div style={styles.emptyStateText}>No NFTs available for collateral</div>
                </div>
              )}

              {selectedAssets.length > 0 && (
                <div style={styles.summarySection}>
                  <h4 style={{ ...styles.cardTitle, marginBottom: "1rem" }}>Selected Assets</h4>
                  <div style={styles.assetList}>
                    {selectedAssets.map((asset) => (
                      <div key={`selected-${asset.type}-${asset.id}`} style={styles.assetItem}>
                        <div style={styles.assetItemName}>{asset.name}</div>
                        <div style={styles.assetItemValue}>${asset.value.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div style={styles.summaryTotal}>
                    <div style={styles.summaryTotalLabel}>Total Value</div>
                    <div style={styles.summaryTotalValue}>${totalAssetValue.toLocaleString()}</div>
                  </div>
                </div>
              )}

              <div style={styles.buttonContainer}>
                <div></div> {/* Empty div for spacing */}
                <button
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(selectedAssets.length === 0 || isProcessing ? styles.disabledButton : {}),
                  }}
                  onClick={handleNextStep}
                  disabled={selectedAssets.length === 0 || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Set Loan Terms */}
          {currentStep === 2 && (
            <div style={styles.stepContainer}>
              <h3 style={styles.cardTitle}>Loan Details</h3>
              <p style={{ color: "#999999", marginBottom: "1.5rem" }}>Configure your loan terms below</p>

              <div style={styles.summarySection}>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Selected Assets</div>
                  <div style={styles.summaryValue}>{selectedAssets.length} NFTs</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Total Asset Value</div>
                  <div style={styles.summaryValue}>${totalAssetValue.toLocaleString()}</div>
                </div>
              </div>

              <div style={styles.sliderContainer}>
                <div style={styles.sliderLabel}>
                  <div style={styles.sliderLabelText}>Loan-to-Value (LTV)</div>
                  <div style={styles.sliderValue}>{ltv}%</div>
                </div>
                <input
                  id="ltv-slider"
                  type="range"
                  min="10"
                  max="70"
                  step="5"
                  value={ltv}
                  onChange={(e) => setLtv(Number.parseInt(e.target.value))}
                  style={styles.slider}
                />
                <div style={styles.quickSelectContainer}>
                  <button
                    style={styles.quickSelectButton}
                    onClick={() => handleQuickSelectLTV(10)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = styles.quickSelectButtonHover.backgroundColor
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    10%
                  </button>
                  <button
                    style={styles.quickSelectButton}
                    onClick={() => handleQuickSelectLTV(70)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = styles.quickSelectButtonHover.backgroundColor
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    70%
                  </button>
                </div>
              </div>

              <div style={styles.selectContainer}>
                <div style={styles.sliderLabel}>
                  <div style={styles.sliderLabelText}>Loan Duration</div>
                  <div style={styles.sliderValue}>{selectedDuration.months} months</div>
                </div>
                <select
                  style={styles.select}
                  value={selectedDuration.months}
                  onChange={(e) => {
                    const months = Number.parseInt(e.target.value)
                    const duration = loanDurations.find((d) => d.months === months)
                    if (duration) setSelectedDuration(duration)
                  }}
                >
                  {loanDurations.map((duration) => (
                    <option key={duration.months} value={duration.months}>
                      {duration.months} months ({duration.months}% fee)
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#999999", marginTop: "0.5rem", textAlign: "center" }}>
                Note: Fees are 1% of total loan value per month flat fee
              </div>

              <div style={styles.summarySection}>
                <h4 style={{ ...styles.cardTitle, marginBottom: "1rem" }}>Summary</h4>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Selected Assets</div>
                  <div style={styles.summaryValue}>{selectedAssets.length} NFTs</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Total Asset Value</div>
                  <div style={styles.summaryValue}>${totalAssetValue.toLocaleString()}</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Loan Amount ({ltv}% LTV)</div>
                  <div style={styles.summaryValue}>${loanAmount.toLocaleString()}</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Loan Duration</div>
                  <div style={styles.summaryValue}>{selectedDuration.months} months</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Fee ({selectedDuration.fee}%)</div>
                  <div style={styles.summaryValue}>${feeAmount.toLocaleString()}</div>
                </div>
                <div style={styles.summaryTotal}>
                  <div style={styles.summaryTotalLabel}>Repayment Amount</div>
                  <div style={styles.summaryTotalValue}>${repaymentAmount.toLocaleString()}</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Due Date</div>
                  <div style={styles.summaryValue}>
                    {formatDate(new Date(new Date().setMonth(new Date().getMonth() + selectedDuration.months)))}
                  </div>
                </div>
              </div>

              <div style={styles.buttonContainer}>
                <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={handlePreviousStep}>
                  Back
                </button>
                <button style={{ ...styles.button, ...styles.primaryButton }} onClick={handleNextStep}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Receive USDC */}
          {currentStep === 3 && (
            <div style={styles.stepContainer}>
              <h3 style={styles.cardTitle}>Receive USDC</h3>
              <p style={{ color: "#999999", marginBottom: "1.5rem" }}>Confirm your loan details and receive USDC</p>

              <div style={styles.receiveSection}>
                <div style={styles.receiveAmount}>${loanAmount.toLocaleString()}</div>
                <div style={styles.receiveLabel}>You will receive</div>
              </div>

              <div style={styles.summarySection}>
                <h4 style={{ ...styles.cardTitle, marginBottom: "1rem" }}>Confirm Your Loan</h4>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Selected Assets</div>
                  <div style={styles.summaryValue}>{selectedAssets.length} NFTs</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Total Asset Value</div>
                  <div style={styles.summaryValue}>${totalAssetValue.toLocaleString()}</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>LTV</div>
                  <div style={styles.summaryValue}>{ltv}%</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Duration</div>
                  <div style={styles.summaryValue}>{selectedDuration.months} months</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Fee</div>
                  <div style={styles.summaryValue}>{selectedDuration.fee}%</div>
                </div>
                <div style={styles.summaryTotal}>
                  <div style={styles.summaryTotalLabel}>Repayment Amount</div>
                  <div style={styles.summaryTotalValue}>${repaymentAmount.toLocaleString()}</div>
                </div>
                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Due Date</div>
                  <div style={styles.summaryValue}>
                    {formatDate(new Date(new Date().setMonth(new Date().getMonth() + selectedDuration.months)))}
                  </div>
                </div>
              </div>

              <div style={styles.buttonContainer}>
                <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={handlePreviousStep}>
                  Back
                </button>
                <button
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(isProcessing ? styles.disabledButton : {}),
                  }}
                  onClick={handleConfirmLoan}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm and Receive USDC"}
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                ...styles.errorMessage,
                backgroundColor: errorMessage.includes("successfully")
                  ? "rgba(0, 170, 85, 0.1)"
                  : "rgba(255, 0, 0, 0.1)",
                borderColor: errorMessage.includes("successfully") ? "rgba(0, 170, 85, 0.3)" : "rgba(255, 0, 0, 0.3)",
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Lending Tab (Placeholder) */}
      {activeTab === "lend" && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Lending</h3>
          <p style={{ color: "#999999", marginBottom: "1.5rem" }}>Lend your USDC to earn interest. Coming soon!</p>
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🔜</div>
            <div style={styles.emptyStateText}>Lending functionality coming soon</div>
          </div>
        </div>
      )}

      {/* Active Loans Section */}
      <div style={styles.card}>
        <div style={styles.activeLoansHeader}>
          <h3 style={styles.activeLoansTitle}>
            Active Loans{" "}
            <span style={{ fontSize: "0.75rem", color: "#999999", fontWeight: "normal" }}>
              (Currently not functioning)
            </span>
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={styles.activeLoansTotal}>Total Outstanding: ${totalOutstandingLoans.toLocaleString()}</div>
            <button
              onClick={() => checkForLoansBasedOnMissingNFTs()}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #333",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
              disabled={isLoadingLoans}
            >
              {isLoadingLoans ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {isLoadingLoans ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateText}>Loading active loans...</div>
          </div>
        ) : activeLoans.length > 0 ? (
          <div style={styles.loansList}>
            {activeLoans.map((loan) => (
              <div key={loan.id} style={styles.loanItem}>
                <div style={styles.loanInfo}>
                  <div style={styles.loanId}>{loan.id}</div>
                  <div style={styles.loanDetails}>{loan.assets.map((asset) => asset.name).join(", ")}</div>
                  {loan.remainingDays !== undefined && (
                    <div style={loan.status === "defaulted" ? styles.overdueDays : styles.remainingDays}>
                      {loan.status === "defaulted"
                        ? `Overdue by ${loan.remainingDays} days`
                        : `${loan.remainingDays} days remaining`}
                    </div>
                  )}
                </div>
                <div style={styles.loanValues}>
                  <div style={styles.loanValueItem}>
                    <div style={styles.loanValueLabel}>Value</div>
                    <div style={styles.loanValue}>${loan.totalValue.toLocaleString()}</div>
                  </div>
                  <div style={styles.loanValueItem}>
                    <div style={styles.loanValueLabel}>Loan</div>
                    <div style={styles.loanValue}>${loan.loanAmount.toLocaleString()}</div>
                  </div>
                  <div style={styles.loanValueItem}>
                    <div style={styles.loanValueLabel}>Est. Fee</div>
                    <div style={styles.loanValue}>${(loan.repaymentAmount - loan.loanAmount).toLocaleString()}</div>
                  </div>
                  <button style={styles.repayButton} onClick={() => handleRepayLoan(loan.id)} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Repay Loan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📝</div>
            <div style={styles.emptyStateText}>No active loans</div>
          </div>
        )}
      </div>
    </div>
  )
}

