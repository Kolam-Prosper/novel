"use client"

import { useState, useEffect } from "react"

// Sample user investments data
const sampleInvestments = [
  {
    id: 1,
    projectName: "Gold Transportation",
    investedAmount: "10,000",
    investedDate: "2023-10-15",
    apy: "18%",
    currentValue: "10,750",
    endDate: "2024-10-15",
    status: "Active",
  },
  {
    id: 2,
    projectName: "Commercial Property",
    investedAmount: "25,000",
    investedDate: "2023-08-22",
    apy: "20%",
    currentValue: "27,500",
    endDate: "2025-02-22",
    status: "Active",
  },
]

const styles = {
  container: {
    backgroundColor: "#111111",
    border: "1px solid #222222",
    borderRadius: "0.5rem",
    padding: "1.5rem",
  },
  notConnectedContainer: {
    backgroundColor: "#1a1a1a",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    textAlign: "center" as const,
  },
  notConnectedText: {
    color: "#ffffff",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "1rem",
  },
  tableContainer: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableHead: {
    textAlign: "left" as const,
  },
  tableHeadCell: {
    padding: "0.75rem 1rem",
    color: "#a0aec0",
    fontWeight: "500",
  },
  tableRow: {
    borderTop: "1px solid #222222",
  },
  tableCell: {
    padding: "1rem",
    color: "#ffffff",
  },
  tableCellWhite: {
    padding: "1rem",
    color: "#ffffff",
    fontWeight: "500",
  },
  tableCellOrange: {
    padding: "1rem",
    color: "#ff6b00",
    fontWeight: "500",
  },
  tableCellGreen: {
    padding: "1rem",
    color: "#10b981",
    fontWeight: "500",
  },
  tableCellGray: {
    padding: "1rem",
    color: "#d1d5db",
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "#10b981",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  summaryContainer: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
  },
  summaryContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: "#a0aec0",
    fontSize: "0.875rem",
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: "1.25rem",
    fontWeight: "500",
  },
  summaryValueGreen: {
    color: "#10b981",
    fontSize: "1.25rem",
    fontWeight: "500",
  },
  summaryValueOrange: {
    color: "#ff6b00",
    fontSize: "1.25rem",
    fontWeight: "500",
  },
}

export function LstUserInvestments() {
  const [investments /* , setInvestments */] = useState(sampleInvestments)
  const [isConnected, setIsConnected] = useState(false)

  // Check if wallet is connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          setIsConnected(accounts.length > 0)
        } catch (error) {
          console.error("Error checking connection:", error)
          setIsConnected(false)
        }
      }
    }

    checkConnection()
  }, [])

  if (!isConnected) {
    return (
      <div style={styles.notConnectedContainer}>
        <p style={styles.notConnectedText}>Connect your wallet to view your investments</p>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div style={styles.notConnectedContainer}>
        <p style={styles.notConnectedText}>You don&apos;t have any active investments yet</p>
        <p style={{ color: "#a0aec0" }}>Browse the available projects below to start investing</p>
      </div>
    )
  }

  // Calculate totals
  const totalInvested = investments.reduce(
    (total, inv) => total + Number.parseInt(inv.investedAmount.replace(/,/g, "")),
    0,
  )
  const totalCurrentValue = investments.reduce(
    (total, inv) => total + Number.parseInt(inv.currentValue.replace(/,/g, "")),
    0,
  )
  const totalProfit = totalCurrentValue - totalInvested

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Your Active Investments</h3>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeadCell}>Project</th>
              <th style={styles.tableHeadCell}>Invested</th>
              <th style={styles.tableHeadCell}>Date</th>
              <th style={styles.tableHeadCell}>APY</th>
              <th style={styles.tableHeadCell}>Current Value</th>
              <th style={styles.tableHeadCell}>End Date</th>
              <th style={styles.tableHeadCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment) => (
              <tr key={investment.id} style={styles.tableRow}>
                <td style={styles.tableCellWhite}>{investment.projectName}</td>
                <td style={styles.tableCell}>${investment.investedAmount}</td>
                <td style={styles.tableCellGray}>{new Date(investment.investedDate).toLocaleDateString()}</td>
                <td style={styles.tableCellOrange}>{investment.apy}</td>
                <td style={styles.tableCellGreen}>${investment.currentValue}</td>
                <td style={styles.tableCellGray}>{new Date(investment.endDate).toLocaleDateString()}</td>
                <td style={styles.tableCell}>
                  <span style={styles.statusBadge}>{investment.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.summaryContainer}>
        <div style={styles.summaryContent}>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Total Invested</p>
            <p style={styles.summaryValue}>${totalInvested.toLocaleString()}</p>
          </div>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Current Value</p>
            <p style={styles.summaryValueGreen}>${totalCurrentValue.toLocaleString()}</p>
          </div>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Profit</p>
            <p style={styles.summaryValueOrange}>${totalProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

