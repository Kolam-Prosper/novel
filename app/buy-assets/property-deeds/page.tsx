"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"

// Contract addresses
const USDC_CONTRACT_ADDRESS = "0x9e190a3FFfA34E513DD65741D2DaEa1CBf5Ca39C"
const PROPERTY_DEED_CONTRACT_ADDRESS = "0x6D1DE98E19e289e646Fd5D47DF8ff3B35740e7a7"

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

// Property Deed Contract ABI with the simplified mint function that worked
const propertyDeedABI = [
  // Simplified mint function that worked
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
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
  deedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  deedItem: {
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
  deedItemActive: {
    borderColor: "#ff6b00",
    boxShadow: "0 0 0 1px #ff6b00",
  },
  deedItemHover: {
    backgroundColor: "#222222",
  },
  deedId: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
  deedLabel: {
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
  totalSupply: {
    color: "#999999",
    marginTop: "0.5rem",
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
}

// Mint price from the contract (3670 * 10^6) - USDC uses 6 decimals
const MINT_PRICE = BigInt(3670) * BigInt(10) ** BigInt(6) // Corrected to use 6 decimals for USDC

export default function PropertyDeeds() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [amount, setAmount] = useState("1")
  const [showFaucetModal, setShowFaucetModal] = useState(false)
  const [usdcBalance, setUsdcBalance] = useState("0")
  const [usdcAllowance, setUsdcAllowance] = useState(BigInt(0))
  const [isCheckingBalance, setIsCheckingBalance] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
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
      await publicClient
        .readContract({
          address: USDC_CONTRACT_ADDRESS as `0x${string}`,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [address],
        })
        .then((balance) => {
          const balanceAsBigInt = balance as bigint
          // Convert from wei to USDC (assuming 6 decimals for USDC)
          const balanceInUsdc = Number(balanceAsBigInt) / 10 ** 6
          setUsdcBalance(Math.floor(balanceInUsdc).toString())
        })
    } catch (error) {
      console.error("Error checking USDC balance:", error)
      setUsdcBalance("0")
    } finally {
      setIsCheckingBalance(false)
    }
  }, [address, isConnected, publicClient])

  // Function to check USDC allowance
  const checkUsdcAllowance = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      setUsdcAllowance(BigInt(0))
      return
    }

    try {
      await publicClient
        .readContract({
          address: USDC_CONTRACT_ADDRESS as `0x${string}`,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address, PROPERTY_DEED_CONTRACT_ADDRESS],
        })
        .then((allowance) => {
          const allowanceAsBigInt = allowance as bigint
          setUsdcAllowance(allowanceAsBigInt)
        })
    } catch (error) {
      console.error("Error checking USDC allowance:", error)
      setUsdcAllowance(BigInt(0))
    }
  }, [address, isConnected, publicClient])

  // Function to check if the user is the contract owner
  const checkContractOwner = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      return
    }

    try {
      const owner = await publicClient.readContract({
        address: PROPERTY_DEED_CONTRACT_ADDRESS as `0x${string}`,
        abi: propertyDeedABI,
        functionName: "owner",
      })

      const isOwner = owner === address
      return isOwner
    } catch (error) {
      console.error("Error checking contract owner:", error)
      return false
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
        args: [PROPERTY_DEED_CONTRACT_ADDRESS, amount],
        account: address,
      })

      // Send the approval transaction
      const approveHash = await walletClient.writeContract(approveRequest)

      // Wait for the transaction to be mined
      await publicClient.waitForTransactionReceipt({ hash: approveHash })

      // Check the allowance again to confirm
      await checkUsdcAllowance()

      return true
    } catch (error) {
      throw error
    }
  }

  // Function to mint using the simplified mint function
  const mintPropertyDeed = async (amountValue: number) => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      throw new Error("Wallet not connected")
    }

    try {
      const { request } = await publicClient.simulateContract({
        address: PROPERTY_DEED_CONTRACT_ADDRESS as `0x${string}`,
        abi: propertyDeedABI,
        functionName: "mint",
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

  // Function to fetch owned property deeds
  const fetchOwnedPropertyDeeds = useCallback(async () => {
    if (!isConnected || !address || !publicClient) {
      return
    }

    // Implementation details removed since this function's results are not used
  }, [address, isConnected, publicClient])

  // Function to handle the entire minting process
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
        message: "Please enter an amount between 1 and 10",
      })
      return
    }

    const amountValue = Number.parseInt(amount)
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > 10) {
      setMintStatus({
        type: "error",
        message: "Please enter a valid amount between 1 and 10",
      })
      return
    }

    setIsProcessing(true)
    setMintStatus({
      type: "loading",
      message: "Processing your transaction...",
    })

    try {
      // Check if user is contract owner
      await checkContractOwner()

      // Check USDC balance
      await checkUsdcBalance()

      // Calculate total USDC needed based on the contract's MINT_PRICE
      const totalUsdcNeeded = MINT_PRICE * BigInt(amountValue)

      // Check current allowance
      await checkUsdcAllowance()

      // Check if we need to approve USDC first
      if (usdcAllowance < totalUsdcNeeded) {
        setStatusMessage("Step 1/2: Approving USDC spending...")

        try {
          await approveUsdc(totalUsdcNeeded)
          setStatusMessage("USDC spending approved! Proceeding to mint...")
        } catch (error) {
          console.error("Error approving USDC:", error)
          throw error
        }
      }

      // Now mint the property deed
      setStatusMessage(`Step ${usdcAllowance < totalUsdcNeeded ? "2/2" : "1/1"}: Minting property deed...`)

      try {
        const result = await mintPropertyDeed(amountValue)

        if (result.success) {
          setLastTxHash(result.hash)
          setMintStatus({
            type: "success",
            message: `Successfully minted ${amountValue} property deed(s)!`,
          })

          // Refresh owned deeds after successful mint
          setTimeout(() => {
            fetchOwnedPropertyDeeds()
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
        if (error.message.includes("execution reverted")) {
          errorMessage += "The contract rejected the transaction. This could be due to:\n"
          errorMessage += "- Insufficient USDC balance or allowance\n"
          errorMessage += "- Only the contract owner can mint tokens\n"
          errorMessage += "Please check your balance and try again."
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
      fetchOwnedPropertyDeeds()
    }
  }, [address, isConnected, publicClient, checkUsdcAllowance, checkUsdcBalance, fetchOwnedPropertyDeeds])

  // Handle amount input change with validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and enforce max of 10
    if (value === "" || (/^\d+$/.test(value) && Number.parseInt(value) <= 10)) {
      setAmount(value)

      // Clear any error messages when the user changes the amount
      if (mintStatus.type === "error") {
        setMintStatus({ type: null, message: "" })
      }
    }
  }

  // Determine if the mint button should be disabled
  const isMintButtonDisabled =
    isProcessing ||
    !isConnected ||
    amount === "" ||
    Number.parseInt(amount || "0") <= 0 ||
    Number.parseInt(amount || "0") > 10

  // Calculate total cost
  const totalCost = amount ? Number.parseInt(amount) * 100000 : 0

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Mint Property Deeds</h1>
        <p style={styles.subtitle}>Purchase digital real estate ownership</p>
      </header>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Purchase Property Deeds</h2>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="amount">
              Amount to mint (Max: 10)
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              max="10"
              style={styles.input}
              value={amount}
              onChange={handleAmountChange}
              disabled={isProcessing}
            />
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
            {isProcessing ? "Processing..." : "Mint Property Deeds"}
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
                Your property deed has been minted successfully. You can view the transaction on the block explorer:
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
          <h2 style={styles.detailsTitle}>Property Deed Details</h2>

          <p style={styles.description}>
            Property Deed - A digital representation of real estate ownership, providing high returns through premium
            property investments in growing markets.
          </p>

          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Price</div>
              <div style={styles.detailValue}>$100,000 USDC</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>APY</div>
              <div style={styles.detailValue}>20%</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Issue Date</div>
              <div style={styles.detailValue}>Upon purchase</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Maturity Date</div>
              <div style={styles.detailValue}>18 months from issue</div>
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

