"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { useState } from "react"

const styles = {
  button: {
    backgroundColor: "#ff6b00", // Orange button
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
    width: "100%",
    display: "block", // Changed from inline to block
    textAlign: "center" as const,
  },
  buttonHover: {
    backgroundColor: "#e05e00", // Darker orange on hover
  },
  disconnectButton: {
    backgroundColor: "transparent",
    color: "#ffffff", // White text
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "background-color 0.2s",
    width: "100%",
  },
  disconnectButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  container: {
    width: "100%",
  },
  addressContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.75rem",
    padding: "0.5rem",
    backgroundColor: "#1a1a1a",
    borderRadius: "0.375rem",
  },
  indicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#00c853", // Green indicator
    marginRight: "0.5rem",
  },
  address: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#ffffff", // White text
  },
}

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [isHovered, setIsHovered] = useState(false)

  if (isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.addressContainer}>
          <div style={styles.indicator}></div>
          <span style={styles.address}>{formatAddress(address || "")}</span>
        </div>
        <button
          onClick={() => disconnect()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...styles.disconnectButton,
            ...(isHovered ? styles.disconnectButtonHover : {}),
          }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.button,
        ...(isHovered ? styles.buttonHover : {}),
      }}
    >
      Connect Wallet
    </button>
  )
}

// Helper function to format address
function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

