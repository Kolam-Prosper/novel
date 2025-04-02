"use client"

import { useAccount, useChainId } from "wagmi"

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  indicator: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  greenIndicator: {
    backgroundColor: "#00c853", // Green indicator
  },
  redIndicator: {
    backgroundColor: "#f44336", // Red indicator
  },
  orangeIndicator: {
    backgroundColor: "#ff6b00", // Orange indicator
  },
  statusInfo: {
    display: "flex",
    flexDirection: "column" as const,
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#ffffff", // White text
    marginBottom: "0.25rem",
  },
  value: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
  },
  addressContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  },
  addressValue: {
    fontSize: "0.875rem",
    fontFamily: "monospace",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Very transparent white
    padding: "0.75rem",
    borderRadius: "0.375rem",
    overflowX: "auto" as const,
    wordBreak: "break-all" as const,
    color: "#ffffff", // White text
  },
  notConnectedMessage: {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Very transparent white
    padding: "1rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
  },
}

export function DappInfo() {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()

  // Get network name
  const getNetworkName = (id: number) => {
    if (id === 1301) return "Unichain Sepolia Testnet"
    return "Unknown Network"
  }

  return (
    <div style={styles.container}>
      <div style={styles.statusContainer}>
        <div
          style={{
            ...styles.indicator,
            ...(isConnected ? styles.greenIndicator : styles.redIndicator),
          }}
        ></div>
        <div style={styles.statusInfo}>
          <p style={styles.label}>Connection Status</p>
          <p style={styles.value}>{isConnected ? "Connected" : "Not Connected"}</p>
        </div>
      </div>

      {isConnected ? (
        <>
          <div style={styles.addressContainer}>
            <p style={styles.label}>Wallet Address</p>
            <p style={styles.addressValue}>{address}</p>
          </div>

          <div style={styles.statusContainer}>
            <div style={{ ...styles.indicator, ...styles.orangeIndicator }}></div>
            <div style={styles.statusInfo}>
              <p style={styles.label}>Network</p>
              <p style={styles.value}>{getNetworkName(chainId)}</p>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.notConnectedMessage}>Connect your wallet to interact with the blockchain</div>
      )}
    </div>
  )
}

