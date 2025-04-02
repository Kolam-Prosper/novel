"use client"

import { useAccount } from "wagmi"
import { useState } from "react"

// Mock transaction data
const mockTransactions = [
  { id: "0x123", type: "Send", amount: "0.1 ETH", to: "0x456...", timestamp: "2023-04-01T12:00:00Z" },
  { id: "0x789", type: "Receive", amount: "0.05 ETH", from: "0xabc...", timestamp: "2023-03-28T10:30:00Z" },
  { id: "0xdef", type: "Contract", amount: "0 ETH", contract: "0x789...", timestamp: "2023-03-25T15:45:00Z" },
]

const styles = {
  container: {
    width: "100%",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff", // White text
  },
  emptyMessage: {
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
  },
  transactionList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  transaction: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.375rem",
    padding: "1rem",
    transition: "background-color 0.2s",
  },
  transactionHover: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  transactionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  typeContainer: {
    display: "flex",
    alignItems: "center",
  },
  indicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "0.5rem",
  },
  sendIndicator: {
    backgroundColor: "#ff6b00", // Orange for send
  },
  receiveIndicator: {
    backgroundColor: "#00c853", // Green for receive
  },
  contractIndicator: {
    backgroundColor: "#9e9e9e", // Gray for contract
  },
  typeText: {
    fontWeight: "500",
    color: "#ffffff", // White text
  },
  timestamp: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.5)", // More transparent white
    marginTop: "0.25rem",
  },
  amountContainer: {
    textAlign: "right" as const,
  },
  amount: {
    fontWeight: "500",
    color: "#ffffff", // White text
  },
  address: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.5)", // More transparent white
    marginTop: "0.25rem",
  },
  notConnectedContainer: {
    textAlign: "center" as const,
    padding: "2rem 0",
  },
  notConnectedMessage: {
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
    marginBottom: "1rem",
  },
  notConnectedSubMessage: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.5)", // More transparent white
  },
}

export function TransactionList() {
  const { isConnected } = useAccount()
  const [transactions] = useState(mockTransactions)

  if (!isConnected) {
    return (
      <div style={styles.notConnectedContainer}>
        <p style={styles.notConnectedMessage}>Connect your wallet to view your transactions</p>
        <p style={styles.notConnectedSubMessage}>
          Your transaction history will appear here once you connect your wallet
        </p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p style={styles.emptyMessage}>No transactions found</p>
      ) : (
        <div style={styles.transactionList}>
          {transactions.map((tx) => (
            <div
              key={tx.id}
              style={styles.transaction}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.transactionHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={styles.transactionHeader}>
                <div>
                  <div style={styles.typeContainer}>
                    <span
                      style={{
                        ...styles.indicator,
                        ...(tx.type === "Receive"
                          ? styles.receiveIndicator
                          : tx.type === "Send"
                            ? styles.sendIndicator
                            : styles.contractIndicator),
                      }}
                    ></span>
                    <span style={styles.typeText}>{tx.type}</span>
                  </div>
                  <p style={styles.timestamp}>{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <div style={styles.amountContainer}>
                  <p style={styles.amount}>{tx.amount}</p>
                  <p style={styles.address}>
                    {tx.to ? `To: ${tx.to}` : tx.from ? `From: ${tx.from}` : `Contract: ${tx.contract}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

