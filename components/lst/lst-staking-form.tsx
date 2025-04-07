"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LstTokenService } from "@/services/lst-token-service"

export function LstStakingForm() {
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("12")
  const [isStaking, setIsStaking] = useState(false)
  const [balance, setBalance] = useState("0")
  const [rewards, setRewards] = useState("0")
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)

  // Initialize service with T-bond contract address
  const contractAddresses = LstTokenService.getContractAddresses()
  const lstService = new LstTokenService(contractAddresses.tbond || "")

  // Check connection and get balance on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await lstService.isConnected()
        setIsConnected(connected)

        if (connected && window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAccount(accounts[0])
            const userBalance = await lstService.getBalance(accounts[0])
            setBalance(userBalance)

            try {
              const userRewards = await lstService.getAvailableRewards()
              setRewards(userRewards)
            } catch (error) {
              console.error("Error fetching rewards:", error)
              setRewards("0")
            }
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }

    checkConnection()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          checkConnection()
        } else {
          setIsConnected(false)
          setAccount(null)
        }
      })
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {})
      }
    }
  }, [lstService])

  // Handle staking
  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    try {
      setIsStaking(true)
      await lstService.stakeTokens(amount)

      // Update balance after staking
      if (account) {
        const userBalance = await lstService.getBalance(account)
        setBalance(userBalance)
      }

      setAmount("")
      alert("Tokens staked successfully!")
    } catch (error) {
      console.error("Error staking tokens:", error)
      alert("Failed to stake tokens. Please try again.")
    } finally {
      setIsStaking(false)
    }
  }

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    try {
      await lstService.claimRewards()

      // Update rewards after claiming
      const userRewards = await lstService.getAvailableRewards()
      setRewards(userRewards)

      alert("Rewards claimed successfully!")
    } catch (error) {
      console.error("Error claiming rewards:", error)
      alert("Failed to claim rewards. Please try again.")
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-[#1a1a1a] p-6 rounded-lg text-center">
        <p className="text-white mb-4">Connect your wallet to stake LST tokens</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Stake LST Tokens</h3>

          <div className="mb-4">
            <p className="text-gray-400 mb-1">Available Balance</p>
            <p className="text-white text-xl font-medium">{Number.parseFloat(balance).toFixed(4)} LST</p>
          </div>

          <form onSubmit={handleStake}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Amount to Stake</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-white"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-1">Staking Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-white"
              >
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isStaking || !amount}
              className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStaking ? "Staking..." : "Stake Tokens"}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Your Rewards</h3>

          <div className="bg-[#111111] p-4 rounded-lg mb-6">
            <p className="text-gray-400 mb-1">Available Rewards</p>
            <p className="text-[#ff6b00] text-2xl font-bold">{Number.parseFloat(rewards).toFixed(4)} LST</p>
          </div>

          <button
            onClick={handleClaimRewards}
            disabled={Number.parseFloat(rewards) <= 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Claim Rewards
          </button>

          <div className="mt-6 p-4 bg-[#111111] rounded-lg">
            <h4 className="text-white font-medium mb-2">Staking Benefits</h4>
            <ul className="text-gray-300 space-y-1 list-disc list-inside">
              <li>Higher APY for longer staking periods</li>
              <li>Rewards distributed monthly</li>
              <li>No early withdrawal penalties</li>
              <li>Use staked tokens as collateral for loans</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

