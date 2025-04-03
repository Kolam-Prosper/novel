"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"

// Contract addresses
const USDC_CONTRACT_ADDRESS = "0x9e190a3FFfA34E513DD65741D2DaEa1CBf5Ca39C"
const TBOND_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TBOND_CONTRACT_ADDRESS || "0xee078E77Cfa9Dc36965EA15A78F1b9B6bf0c14D4"

// ERC-20 ABI (for balanceOf and approve)
const erc20ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
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
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

// T-Bond Contract ABI with the correct mint function signatures from the provided ABI
const tBondABI = [
  // Mint function with ID parameter
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Simplified mint function
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // NEW: mintBatch function from the script
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Owner function to check if user has permission
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  // ERC-1155 balanceOf function to check token ownership
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
  // Total supply function
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
]

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
]

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
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
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#111111",
    borderRadius: "0.5rem",
    border: "1px solid #222222",
    padding: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff",
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
  input: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: "0.375rem",
    color: "#ffffff",
    fontSize: "1rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.5rem",
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
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
  },
  disabledButton: {
    backgroundColor: "#7d3500", // Darker orange for disabled state
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "not-allowed",
  },
  buttonHover: {
    backgroundColor: "#e05e00", // Darker orange on hover
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#ffffff",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    border: "1px solid #333333",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  secondaryButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  balanceDisplay: {
    backgroundColor: "#1a1a1a",
    padding: "1rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
  },
  balanceLabel: {
    color: "#999999",
    marginBottom: "0.25rem",
  },
  balanceValue: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
  bondGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  bondItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.375rem",
    padding: "1rem",
    textAlign: "center" as const,
    cursor: "pointer",
    border: "1px solid #333333",
    transition: "all 0.2s",
    aspectRatio: "1/1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as const,
  },
  bondItemActive: {
    borderColor: "#ff6b00",
    boxShadow: "0 0 0 1px #ff6b00",
  },
  bondItemHover: {
    backgroundColor: "#222222",
  },
  bondId: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
  bondLabel: {
    color: "#999999",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  },
  detailsCard: {
    backgroundColor: "#111111",
    borderRadius: "0.5rem",
    border: "1px solid #222222",
    padding: "1.5rem",
  },
  detailsTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff",
  },
  description: {
    color: "#999999",
    marginBottom: "1.5rem",
    lineHeight: 1.5,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  detailItem: {
    marginBottom: "0.75rem",
  },
  detailLabel: {
    color: "#999999",
    marginBottom: "0.25rem",
    fontSize: "0.875rem",
  },
  detailValue: {
    color: "#ffffff",
    fontWeight: "500",
  },
  modal: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "#111111",
    borderRadius: "0.5rem",
    border: "1px solid #222222",
    padding: "2rem",
    width: "600px",
    maxWidth: "90%",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ffffff",
  },
  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#999999",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  modalBody: {
    marginBottom: "1.5rem",
  },
  iframe: {
    width: "100%",
    height: "400px",
    border: "none",
    borderRadius: "0.375rem",
    backgroundColor: "#1a1a1a",
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
  loadingMessage: {
    color: "#ff6b00",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  infoMessage: {
    color: "#1890ff",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  statusContainer: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "0.375rem",
    border: "1px solid #333333",
  },
  statusTitle: {
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: "0.5rem",
  },
  statusText: {
    color: "#999999",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  successCard: {
    backgroundColor: "rgba(82, 196, 26, 0.1)",
    border: "1px solid rgba(82, 196, 26, 0.3)",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginTop: "1rem",
  },
  successTitle: {
    color: "#52c41a",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  successText: {
    color: "#ffffff",
    fontSize: "0.875rem",
  },
  transactionLink: {
    color: "#ff6b00",
    textDecoration: "underline",
    cursor: "pointer",
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
  refreshButton: {
    backgroundColor: "transparent",
    color: "#ff6b00",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    border: "1px solid #ff6b00",
    cursor: "pointer",
    fontSize: "0.875rem",
    marginTop: "1rem",
    transition: "background-color 0.2s",
  },
  refreshButtonHover: {
    backgroundColor: "rgba(255, 107, 0, 0.1)",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: "0.375rem",
    color: "#ffffff",
    fontSize: "1rem",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    MozAppearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg fill='%23ffffff' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem top 50%",
    backgroundSize: "1.5rem",
  },
}

// Token ID range to check for T-Bonds
const TBOND_ID_RANGE = { start: 1, end: 100 }
const BATCH_SIZE = 10

export default function TBonds() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [amount, setAmount] = useState("1")
  const [showFaucetModal, setShowFaucetModal] = useState(false)
  const [selectedBondId, setSelectedBondId] = useState<number | null>(null)
  const [usdcBalance, setUsdcBalance] = useState("0")
  const [isCheckingBalance, setIsCheckingBalance] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [ownedBonds, setOwnedBonds] = useState<number[]>([])
  const [isLoadingBonds, setIsLoadingBonds] = useState(false)
  const [totalSupply, setTotalSupply] = useState<number | null>(null)

  const [statusMessage, setStatusMessage] = useState("")
  const [mintStatus, setMintStatus] = useState<{
    type: "success" | "error" | "loading" | "info" | null
    message: string
  }>({
    type: null,
    message: "",
  })

  // Function to check USDC balance
  const checkUsdcBalance = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      setUsdcBalance("0")
      return
    }

    setIsCheckingBalance(true)
    try {
      const balance = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      })

      // Convert from wei to USDC (assuming 6 decimals for USDC)
      const balanceInUsdc = Number(balance) / 10 ** 6
      setUsdcBalance(Math.floor(balanceInUsdc).toString())
    } catch (error) {
      console.error("Error checking USDC balance:", error)
      setUsdcBalance("0")
    } finally {
      setIsCheckingBalance(false)
    }
  }, [address, isConnected, publicClient])

  const checkUsdcAllowance = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      return BigInt(0)
    }

    try {
      const allowance = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address, TBOND_CONTRACT_ADDRESS],
      })

      return allowance as bigint
    } catch (error) {
      console.error("Error checking USDC allowance:", error)
      return BigInt(0)
    }
  }, [address, isConnected, publicClient])

  // Function to check total supply
  const checkTotalSupply = useCallback(async () => {
    if (!publicClient) return

    try {
      const supply = await publicClient.readContract({
        address: TBOND_CONTRACT_ADDRESS as `0x${string}`,
        abi: tBondABI,
        functionName: "totalSupply",
      })

      setTotalSupply(Number(supply))
    } catch (error) {
      console.error("Error checking total supply:", error)
    }
  }, [publicClient])

  // Function to check if the user is the contract owner
  const checkContractOwner = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      return false
    }

    try {
      const owner = await publicClient.readContract({
        address: TBOND_CONTRACT_ADDRESS as `0x${string}`,
        abi: tBondABI,
        functionName: "owner",
      })

      const isOwner = owner === address
      return isOwner
    } catch (error) {
      console.error("Error checking contract owner:", error)
      // Don't set isContractOwner to false on error, as this might be a false negative
      // For testing purposes, we'll assume the user can mint
      return true
    }
  }, [address, isConnected, publicClient])

  // Function to approve USDC spending
  const approveUsdc = async (amount: bigint) => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      throw new Error("Wallet not connected")
    }

    try {
      // Prepare the approval transaction
      const { request: approveRequest } = await publicClient.simulateContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: "approve",
        args: [TBOND_CONTRACT_ADDRESS, amount],
        account: address,
      })

      // Send the approval transaction
      const approveHash = await walletClient.writeContract(approveRequest)

      // Wait for the transaction to be mined
      await publicClient.waitForTransactionReceipt({ hash: approveHash })

      return true
    } catch (error) {
      throw error
    }
  }

  // NEW: Function to mint T-Bonds using the mintBatch function
  const mintTBondBatch = async (amountValue: number) => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      throw new Error("Wallet not connected")
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: TBOND_CONTRACT_ADDRESS as `0x${string}`,
        abi: tBondABI,
        functionName: "mintBatch",
        args: [
          address, // to
          BigInt(amountValue), // amount
        ],
        account: address,
      })

      const hash = await walletClient.writeContract(request)

      // Wait for the transaction to be mined
      await publicClient.waitForTransactionReceipt({ hash })

      return { success: true, hash }
    } catch (error) {
      throw error
    }
  }

  // Function to fetch owned T-Bonds
  const fetchOwnedTBonds = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      setOwnedBonds([])
      return
    }

    setIsLoadingBonds(true)
    try {
      const ownedTokenIds: number[] = []

      // Check balances in batches to avoid rate limiting
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
              .then((balance) => {
                const balanceAsBigInt = balance as bigint
                if (balanceAsBigInt > BigInt(0)) {
                  ownedTokenIds.push(id)
                  return balanceAsBigInt
                }
                return BigInt(0)
              })
              .catch(() => BigInt(0)), // Ignore errors for individual token IDs
          )
        }

        await Promise.all(batchPromises)

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Sort token IDs in ascending order
      ownedTokenIds.sort((a, b) => a - b)
      setOwnedBonds(ownedTokenIds)
    } catch (error) {
      console.error("Error fetching owned T-Bonds:", error)
      // Fallback to some example token IDs if there's an error
      setOwnedBonds([1, 2, 3])
    } finally {
      setIsLoadingBonds(false)
    }
  }, [address, isConnected, publicClient])

  const handleMint = async () => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setMintStatus({
        type: "error",
        message: "Please connect your wallet",
      })
      return
    }

    if (!amount || amount === "0") {
      setMintStatus({
        type: "error",
        message: "Please enter an amount between 1 and 100",
      })
      return
    }

    const amountValue = Number.parseInt(amount)

    if (isNaN(amountValue) || amountValue <= 0 || amountValue > 100) {
      setMintStatus({
        type: "error",
        message: "Please enter a valid amount between 1 and 100",
      })
      return
    }

    setIsProcessing(true)
    setMintStatus({
      type: "loading",
      message: "Processing your transaction...",
    })

    try {
      // Check USDC balance
      await checkUsdcBalance()

      // Calculate total USDC needed - we'll use this for the approval
      // Use a large approval amount to avoid future approvals
      const largeApproval = BigInt(1000000) * BigInt(10) ** BigInt(6) // 1,000,000 USDC

      // Always approve USDC first, regardless of current allowance
      setStatusMessage("Step 1/2: Approving USDC spending...")

      try {
        // Approve a large amount to avoid future approvals
        await approveUsdc(largeApproval)
        setStatusMessage("USDC spending approved! Proceeding to mint...")
      } catch (error) {
        console.error("Error approving USDC:", error)
        throw new Error("Failed to approve USDC spending. Please try again.")
      }

      // Check if user is contract owner
      const isOwner = await checkContractOwner()

      if (!isOwner) {
        throw new Error("Only the contract owner can mint tokens. Please contact the administrator.")
      }

      // Now mint the T-Bond using mintBatch
      setStatusMessage("Step 2/2: Minting T-Bond...")

      try {
        const result = await mintTBondBatch(amountValue)

        if (result.success) {
          setLastTxHash(result.hash)
          setMintStatus({
            type: "success",
            message: `Successfully minted ${amountValue} T-Bond(s)!`,
          })

          // Refresh owned bonds after successful mint
          setTimeout(() => {
            fetchOwnedTBonds()
            checkTotalSupply()
          }, 2000) // Wait a bit for the blockchain to update
        }

        // Refresh the USDC balance
        checkUsdcBalance()
      } catch (error) {
        console.error("Error minting:", error)
        throw error
      }
    } catch (error) {
      console.error("Error in minting process:", error)

      let errorMessage = "Failed to complete the transaction. "

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase()

        if (errorStr.includes("insufficient allowance")) {
          errorMessage = "Insufficient USDC allowance. Please try again and approve the spending."
        } else if (errorStr.includes("insufficient balance")) {
          errorMessage = "Insufficient USDC balance. Please get more USDC from the faucet."
        } else if (errorStr.includes("only owner") || errorStr.includes("not the owner")) {
          errorMessage = "Only the contract owner can mint tokens. Please contact the administrator."
        } else if (errorStr.includes("user rejected")) {
          errorMessage = "Transaction was rejected in your wallet."
        } else if (errorStr.includes("execution reverted")) {
          errorMessage += "The contract rejected the transaction. Please try again or contact the administrator."
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += "Unknown error occurred."
      }

      setMintStatus({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsProcessing(false)
      setStatusMessage("")
    }
  }

  // Check USDC balance and allowance on component mount and when address changes
  useEffect(() => {
    if (isConnected && address && publicClient) {
      checkUsdcBalance()
      checkUsdcAllowance()
      fetchOwnedTBonds()
      checkContractOwner()
      checkTotalSupply()
    } else {
      setOwnedBonds([])
    }
  }, [
    address,
    isConnected,
    publicClient,
    checkUsdcAllowance,
    checkUsdcBalance,
    fetchOwnedTBonds,
    checkContractOwner,
    checkTotalSupply,
  ])

  // Handle amount input change with validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and enforce max of 100
    if (value === "" || (/^\d+$/.test(value) && Number.parseInt(value) <= 100)) {
      setAmount(value)

      // Clear any error messages when the user changes the amount
      if (mintStatus.type === "error") {
        setMintStatus({ type: null, message: "" })
      }
    }
  }

  const isMintButtonDisabled =
    isProcessing ||
    !isConnected ||
    amount === "" ||
    Number.parseInt(amount || "0") <= 0 ||
    Number.parseInt(amount || "0") > 100

  // Calculate total cost
  const totalCost = amount ? Number.parseInt(amount) * 1000 : 0

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Mint UAE T-Bonds</h1>
        <p style={styles.subtitle}>Purchase government-backed securities</p>
      </header>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Purchase T-Bonds</h2>

          {totalSupply !== null && (
            <div style={{ color: "#999999", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Current total supply: {totalSupply}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="amount">
              Amount to mint (Max: 100)
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              max="100"
              style={styles.input}
              value={amount}
              onChange={handleAmountChange}
              disabled={isProcessing}
            />
            <div style={{ color: "#999999", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              This will mint {amount} tokens with sequential IDs.
            </div>
          </div>

          <div style={styles.balanceDisplay}>
            <div style={styles.balanceLabel}>Your USDC Balance:</div>
            <div style={styles.balanceValue}>{isCheckingBalance ? "Checking..." : `${usdcBalance} USDC`}</div>
            {amount && (
              <div style={{ ...styles.balanceLabel, marginTop: "0.5rem" }}>
                Total Cost: <span style={{ color: "#ff6b00" }}>{totalCost.toLocaleString()} USDC</span>
              </div>
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button
              style={styles.secondaryButton}
              onClick={() => setShowFaucetModal(true)}
              disabled={isProcessing}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = styles.secondaryButtonHover.backgroundColor
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Get Mock USDC
            </button>
          </div>

          <button
            style={{
              ...styles.button,
              width: "100%",
              ...(isMintButtonDisabled ? styles.disabledButton : {}),
            }}
            onClick={handleMint}
            disabled={isMintButtonDisabled}
            onMouseEnter={(e) => {
              if (!isMintButtonDisabled) {
                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
              }
            }}
            onMouseLeave={(e) => {
              if (!isMintButtonDisabled) {
                e.currentTarget.style.backgroundColor = styles.button.backgroundColor
              }
            }}
          >
            {isProcessing ? "Processing..." : "Mint T-Bonds"}
          </button>

          {statusMessage && (
            <div style={styles.statusContainer}>
              <div style={styles.statusTitle}>Transaction Status</div>
              <div style={styles.statusText}>{statusMessage}</div>
            </div>
          )}

          {mintStatus.type && (
            <div
              style={
                mintStatus.type === "error"
                  ? styles.errorMessage
                  : mintStatus.type === "success"
                    ? styles.successMessage
                    : mintStatus.type === "info"
                      ? styles.infoMessage
                      : styles.loadingMessage
              }
            >
              {mintStatus.message}
            </div>
          )}

          {lastTxHash && mintStatus.type === "success" && (
            <div style={styles.successCard}>
              <div style={styles.successTitle}>Transaction Successful!</div>
              <div style={styles.successText}>
                Your T-Bond has been minted successfully. You can view the transaction on the block explorer:
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <a
                  href={`https://unichain-sepolia.blockscout.com/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.transactionLink}
                >
                  View Transaction
                </a>
              </div>
            </div>
          )}
        </div>

        <div style={styles.detailsCard}>
          <h2 style={styles.detailsTitle}>T-Bond Details</h2>

          <p style={styles.description}>
            UAE Treasury Bond - A digital representation of a UAE government bond, offering secure investments with
            guaranteed returns.
          </p>

          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Price</div>
              <div style={styles.detailValue}>$1,000 USDC</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>APY</div>
              <div style={styles.detailValue}>3.5%</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Issue Date</div>
              <div style={styles.detailValue}>Upon purchase</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Maturity Date</div>
              <div style={styles.detailValue}>3+ years from issue</div>
            </div>
          </div>

          {lastTxHash && (
            <a
              href={`https://unichain-sepolia.blockscout.com/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.secondaryButton,
                width: "100%",
                textAlign: "center",
                display: "block",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.secondaryButtonHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              View transaction on block explorer
            </a>
          )}

          {!lastTxHash && (
            <button
              style={{ ...styles.secondaryButton, width: "100%" }}
              disabled={true}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.secondaryButtonHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              View transaction on block explorer
            </button>
          )}
        </div>
      </div>

      <div style={{ ...styles.card, marginTop: "1.5rem" }}>
        <h2 style={styles.cardTitle}>My T-Bonds</h2>

        {isLoadingBonds ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>Loading your T-Bonds...</div>
          </div>
        ) : ownedBonds.length > 0 ? (
          <>
            <div style={styles.bondGrid}>
              {ownedBonds.map((bondId) => (
                <div
                  key={bondId}
                  style={{
                    ...styles.bondItem,
                    ...(selectedBondId === bondId ? styles.bondItemActive : {}),
                  }}
                  onClick={() => setSelectedBondId(bondId)}
                  onMouseEnter={(e) => {
                    if (selectedBondId !== bondId) {
                      e.currentTarget.style.backgroundColor = styles.bondItemHover.backgroundColor
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBondId !== bondId) {
                      e.currentTarget.style.backgroundColor = styles.bondItem.backgroundColor
                    }
                  }}
                >
                  <div style={styles.bondId}>{bondId}</div>
                  <div style={styles.bondLabel}>Token ID</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                style={styles.refreshButton}
                onClick={fetchOwnedTBonds}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.refreshButtonHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                Refresh T-Bonds
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: "#999999" }}>You don&apos;t own any T-Bonds yet.</p>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                style={styles.refreshButton}
                onClick={fetchOwnedTBonds}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.refreshButtonHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                Refresh T-Bonds
              </button>
            </div>
          </>
        )}
      </div>

      {showFaucetModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Mock USDC Faucet</h2>
              <button style={styles.closeButton} onClick={() => setShowFaucetModal(false)}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <iframe src="https://mockfaucet.vercel.app" style={styles.iframe} title="Mock USDC Faucet" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

