import { createPublicClient, http, createWalletClient, custom, parseEther, formatEther } from "viem"
import { mainnet } from "viem/chains"

// ABI for the LST token contract (simplified for this example)
const lstTokenAbi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "stake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "unstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getRewards",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "claimRewards",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

// Contract addresses from environment variables
const tbondContractAddress = process.env.NEXT_PUBLIC_TBOND_CONTRACT_ADDRESS
const propertyDeedContractAddress = process.env.NEXT_PUBLIC_PROPERTY_DEED_CONTRACT_ADDRESS

export class LstTokenService {
  private publicClient: ReturnType<typeof createPublicClient> | null = null
  private walletClient: ReturnType<typeof createWalletClient> | null = null
  private contractAddress: `0x${string}` | null = null
  private account: `0x${string}` | null = null

  constructor(contractAddress: string) {
    if (typeof window !== "undefined" && window.ethereum) {
      this.contractAddress = contractAddress as `0x${string}`

      this.publicClient = createPublicClient({
        chain: mainnet,
        transport: http(),
      })

      this.walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      })
    }
  }

  // Check if wallet is connected
  async isConnected(): Promise<boolean> {
    if (!this.walletClient) return false

    try {
      const accounts = await this.walletClient.getAddresses()
      if (accounts.length > 0) {
        this.account = accounts[0]
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking connection:", error)
      return false
    }
  }

  // Get LST token balance
  async getBalance(address: string): Promise<string> {
    if (!this.publicClient || !this.contractAddress) throw new Error("Client not initialized")

    try {
      const balance = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: lstTokenAbi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      })

      return formatEther(balance)
    } catch (error) {
      console.error("Error getting balance:", error)
      throw error
    }
  }

  // Stake LST tokens
  async stakeTokens(amount: string): Promise<boolean> {
    if (!this.walletClient || !this.contractAddress || !this.account)
      throw new Error("Client not initialized or not connected")

    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: lstTokenAbi,
        functionName: "stake",
        args: [parseEther(amount)],
        account: this.account,
      })

      // Wait for transaction to be mined
      if (this.publicClient) {
        await this.publicClient.waitForTransactionReceipt({ hash })
      }

      return true
    } catch (error) {
      console.error("Error staking tokens:", error)
      throw error
    }
  }

  // Unstake LST tokens
  async unstakeTokens(amount: string): Promise<boolean> {
    if (!this.walletClient || !this.contractAddress || !this.account)
      throw new Error("Client not initialized or not connected")

    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: lstTokenAbi,
        functionName: "unstake",
        args: [parseEther(amount)],
        account: this.account,
      })

      // Wait for transaction to be mined
      if (this.publicClient) {
        await this.publicClient.waitForTransactionReceipt({ hash })
      }

      return true
    } catch (error) {
      console.error("Error unstaking tokens:", error)
      throw error
    }
  }

  // Get available rewards
  async getAvailableRewards(): Promise<string> {
    if (!this.publicClient || !this.contractAddress) throw new Error("Client not initialized")

    try {
      const rewards = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: lstTokenAbi,
        functionName: "getRewards",
        args: [],
      })

      return formatEther(rewards)
    } catch (error) {
      console.error("Error getting rewards:", error)
      throw error
    }
  }

  // Claim rewards
  async claimRewards(): Promise<boolean> {
    if (!this.walletClient || !this.contractAddress || !this.account)
      throw new Error("Client not initialized or not connected")

    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: lstTokenAbi,
        functionName: "claimRewards",
        args: [],
        account: this.account,
      })

      // Wait for transaction to be mined
      if (this.publicClient) {
        await this.publicClient.waitForTransactionReceipt({ hash })
      }

      return true
    } catch (error) {
      console.error("Error claiming rewards:", error)
      throw error
    }
  }

  // Get contract addresses
  static getContractAddresses() {
    return {
      tbond: tbondContractAddress,
      propertyDeed: propertyDeedContractAddress,
    }
  }
}

