"use client"

import { useState } from "react"
import { useAssetCount, formatCurrency, AED_TO_USD_RATE } from "@/components/asset-counter"
import { CurrencyToggle } from "@/components/currency-toggle"

// Contract addresses from environment variables
const TBOND_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TBOND_CONTRACT_ADDRESS || "0xee078E77Cfa9Dc36965EA15A78F1b9B6bf0c14D4"
const PROPERTY_DEED_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_PROPERTY_DEED_CONTRACT_ADDRESS || "0x6D1DE98E19e289e646Fd5D47DF8ff3B35740e7a7"

// Asset values in USDC
const TBOND_VALUE = 1000 // $1,000 USDC per T-Bond
const PROPERTY_DEED_VALUE = 100000 // $100,000 USDC per Property Deed

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
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#111111",
    borderRadius: "0.5rem",
    border: "1px solid #222222",
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#ffffff",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1rem",
    textAlign: "center" as const,
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ff6b00", // Orange
    marginBottom: "0.25rem",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#999999",
  },
  activityCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "0.75rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  activityIcon: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    backgroundColor: "#333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    color: "#ffffff",
  },
  activityInfo: {
    display: "flex",
    flexDirection: "column" as const,
  },
  activityTitle: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#ffffff",
  },
  activityTime: {
    fontSize: "0.75rem",
    color: "#999999",
  },
  activityAmount: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#ff6b00", // Orange
  },
  loadingText: {
    color: "#999999",
    fontStyle: "italic",
  },
  tokenList: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  tokenBadge: {
    backgroundColor: "#333333",
    color: "#ffffff",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
  },
  tokenListTitle: {
    fontSize: "0.875rem",
    color: "#999999",
    marginTop: "0.75rem",
  },
  note: {
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    border: "1px solid rgba(255, 107, 0, 0.3)",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginTop: "1rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  assetDetails: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1rem",
    marginTop: "1rem",
  },
  assetDetailsTitle: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: "0.75rem",
  },
  assetDetailsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  assetDetailsLabel: {
    color: "#999999",
  },
  assetDetailsValue: {
    color: "#ffffff",
  },
  assetDetailsLink: {
    color: "#ff6b00",
    textDecoration: "none",
  },
  assetDetailsLinkHover: {
    textDecoration: "underline",
  },
  errorMessage: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    border: "1px solid rgba(255, 0, 0, 0.3)",
    borderRadius: "0.375rem",
    padding: "1rem",
    marginTop: "1rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  valueRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem",
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    borderRadius: "0.375rem",
    marginTop: "0.5rem",
  },
  valueLabel: {
    color: "#ffffff",
    fontWeight: "500",
  },
  valueAmount: {
    color: "#ff6b00",
    fontWeight: "bold",
  },
  currencyInfo: {
    fontSize: "0.75rem",
    color: "#999999",
    marginTop: "0.5rem",
    textAlign: "right" as const,
  },
}

export default function Dashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "AED">("USD")

  const {
    totalAssets,
    tBondCount,
    propertyDeedCount,
    // stakedCount,
    // loanedCount,
    // lstBalance,
    totalValue,
    tBondValue,
    propertyDeedValue,
    stakedValue,
    loanedValue,
    lstValue,
    ownedTBonds,
    ownedPropertyDeeds,
    isLoading,
    error,
  } = useAssetCount()

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Overview of your DeFi portfolio</p>
      </header>

      <div style={styles.grid}>
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Portfolio Overview</h2>
            <CurrencyToggle currency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {isLoading ? (
                  <span style={styles.loadingText}>Loading...</span>
                ) : (
                  formatCurrency(totalValue, selectedCurrency)
                )}
              </div>
              <div style={styles.statLabel}>Total Value</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {isLoading ? <span style={styles.loadingText}>Loading...</span> : totalAssets}
              </div>
              <div style={styles.statLabel}>Assets</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {isLoading ? (
                  <span style={styles.loadingText}>Loading...</span>
                ) : (
                  formatCurrency(stakedValue, selectedCurrency)
                )}
              </div>
              <div style={styles.statLabel}>Staked</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {isLoading ? (
                  <span style={styles.loadingText}>Loading...</span>
                ) : (
                  formatCurrency(loanedValue, selectedCurrency)
                )}
              </div>
              <div style={styles.statLabel}>Loaned</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {isLoading ? (
                  <span style={styles.loadingText}>Loading...</span>
                ) : (
                  formatCurrency(lstValue, selectedCurrency)
                )}
              </div>
              <div style={styles.statLabel}>LST Balance</div>
            </div>
          </div>

          {selectedCurrency === "AED" && (
            <div style={styles.currencyInfo}>Exchange Rate: 1 USD = {AED_TO_USD_RATE} AED</div>
          )}
        </div>

        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h2 style={styles.cardTitle}>Your Assets</h2>

          {error && (
            <div style={styles.errorMessage}>
              <strong>Note:</strong> {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={styles.activityCard}>
              <div style={styles.activityLeft}>
                <div style={styles.activityIcon}>T</div>
                <div style={styles.activityInfo}>
                  <div style={styles.activityTitle}>UAE T-Bonds</div>
                  <div style={styles.activityTime}>{isLoading ? "Loading..." : "Current holdings"}</div>
                </div>
              </div>
              <div style={styles.activityAmount}>
                {isLoading ? <span style={styles.loadingText}>Loading...</span> : tBondCount}
              </div>
            </div>

            {!isLoading && ownedTBonds.length > 0 && (
              <>
                <div style={styles.valueRow}>
                  <span style={styles.valueLabel}>Total T-Bond Value:</span>
                  <span style={styles.valueAmount}>{formatCurrency(tBondValue, selectedCurrency)}</span>
                </div>

                <div style={styles.tokenListTitle}>Your T-Bond IDs:</div>
                <div style={styles.tokenList}>
                  {ownedTBonds.map((id) => (
                    <span key={`tbond-${id}`} style={styles.tokenBadge}>
                      #{id}
                    </span>
                  ))}
                </div>

                <div style={styles.assetDetails}>
                  <div style={styles.assetDetailsTitle}>T-Bond Details</div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>Contract:</span>
                    <a
                      href={`https://unichain-sepolia.blockscout.com/token/${TBOND_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.assetDetailsLink}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = "underline"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = "none"
                      }}
                    >
                      View on Explorer
                    </a>
                  </div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>Type:</span>
                    <span style={styles.assetDetailsValue}>T-Bonds</span>
                  </div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>Value per Bond:</span>
                    <span style={styles.assetDetailsValue}>{formatCurrency(TBOND_VALUE, selectedCurrency)}</span>
                  </div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>APY:</span>
                    <span style={styles.assetDetailsValue}>3.5%</span>
                  </div>
                </div>
              </>
            )}

            <div style={styles.activityCard}>
              <div style={styles.activityLeft}>
                <div style={styles.activityIcon}>P</div>
                <div style={styles.activityInfo}>
                  <div style={styles.activityTitle}>Property Deeds</div>
                  <div style={styles.activityTime}>{isLoading ? "Loading..." : "Current holdings"}</div>
                </div>
              </div>
              <div style={styles.activityAmount}>
                {isLoading ? <span style={styles.loadingText}>Loading...</span> : propertyDeedCount}
              </div>
            </div>

            {!isLoading && ownedPropertyDeeds.length > 0 && (
              <>
                <div style={styles.valueRow}>
                  <span style={styles.valueLabel}>Total Property Deed Value:</span>
                  <span style={styles.valueAmount}>{formatCurrency(propertyDeedValue, selectedCurrency)}</span>
                </div>

                <div style={styles.tokenListTitle}>Your Property Deed IDs:</div>
                <div style={styles.tokenList}>
                  {ownedPropertyDeeds.map((id) => (
                    <span key={`deed-${id}`} style={styles.tokenBadge}>
                      #{id}
                    </span>
                  ))}
                </div>

                <div style={styles.assetDetails}>
                  <div style={styles.assetDetailsTitle}>Property Deed Details</div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>Contract:</span>
                    <a
                      href={`https://unichain-sepolia.blockscout.com/token/${PROPERTY_DEED_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.assetDetailsLink}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = "underline"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = "none"
                      }}
                    >
                      View on Explorer
                    </a>
                  </div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>Type:</span>
                    <span style={styles.assetDetailsValue}>Real Estate</span>
                  </div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>Value per Deed:</span>
                    <span style={styles.assetDetailsValue}>
                      {formatCurrency(PROPERTY_DEED_VALUE, selectedCurrency)}
                    </span>
                  </div>
                  <div style={styles.assetDetailsRow}>
                    <span style={styles.assetDetailsLabel}>APY:</span>
                    <span style={styles.assetDetailsValue}>20%</span>
                  </div>
                </div>
              </>
            )}

            {isLoading && (
              <div style={styles.note}>
                <strong>Loading:</strong> Scanning blockchain for your assets. This may take a moment...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

