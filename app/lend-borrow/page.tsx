"use client"

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
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableHeader: {
    textAlign: "left" as const,
    padding: "0.75rem 1rem",
    color: "#999999",
    borderBottom: "1px solid #333333",
  },
  tableCell: {
    padding: "1rem",
    borderBottom: "1px solid #222222",
    color: "#ffffff",
  },
  assetCell: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  assetIcon: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    backgroundColor: "#333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  assetInfo: {
    display: "flex",
    flexDirection: "column" as const,
  },
  assetName: {
    fontWeight: "500",
  },
  assetSymbol: {
    fontSize: "0.875rem",
    color: "#999999",
  },
  actionButton: {
    backgroundColor: "#ff6b00", // Orange button
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
  },
  actionButtonHover: {
    backgroundColor: "#e05e00", // Darker orange on hover
  },
  statsCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
  },
  statItem: {
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
}

// Mock market data
const marketData = [
  {
    id: 1,
    symbol: "ETH",
    name: "Ethereum",
    apy: { supply: "2.5%", borrow: "4.2%" },
    totalSupply: "$125M",
    totalBorrow: "$78M",
    available: "$47M",
  },
  {
    id: 2,
    symbol: "USDC",
    name: "USD Coin",
    apy: { supply: "3.8%", borrow: "5.1%" },
    totalSupply: "$250M",
    totalBorrow: "$180M",
    available: "$70M",
  },
  {
    id: 3,
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    apy: { supply: "1.9%", borrow: "3.5%" },
    totalSupply: "$85M",
    totalBorrow: "$42M",
    available: "$43M",
  },
  {
    id: 4,
    symbol: "DAI",
    name: "Dai Stablecoin",
    apy: { supply: "3.5%", borrow: "4.8%" },
    totalSupply: "$150M",
    totalBorrow: "$95M",
    available: "$55M",
  },
]

export default function LendBorrow() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Lend & Borrow</h1>
        <p style={styles.subtitle}>Supply assets to earn interest or borrow against your collateral</p>
      </header>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Your Overview</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>$0.00</div>
            <div style={styles.statLabel}>Supply Balance</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>$0.00</div>
            <div style={styles.statLabel}>Borrow Balance</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>0%</div>
            <div style={styles.statLabel}>Net APY</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>0%</div>
            <div style={styles.statLabel}>Health Factor</div>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <div style={{ ...styles.tab, ...styles.tabActive }}>All Markets</div>
        <div style={styles.tab}>Your Supplies</div>
        <div style={styles.tab}>Your Borrows</div>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Asset</th>
              <th style={styles.tableHeader}>Supply APY</th>
              <th style={styles.tableHeader}>Borrow APY</th>
              <th style={styles.tableHeader}>Total Supply</th>
              <th style={styles.tableHeader}>Total Borrow</th>
              <th style={styles.tableHeader}>Available</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((asset) => (
              <tr key={asset.id}>
                <td style={styles.tableCell}>
                  <div style={styles.assetCell}>
                    <div style={styles.assetIcon}>{asset.symbol.charAt(0)}</div>
                    <div style={styles.assetInfo}>
                      <div style={styles.assetName}>{asset.name}</div>
                      <div style={styles.assetSymbol}>{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.tableCell}>{asset.apy.supply}</td>
                <td style={styles.tableCell}>{asset.apy.borrow}</td>
                <td style={styles.tableCell}>{asset.totalSupply}</td>
                <td style={styles.tableCell}>{asset.totalBorrow}</td>
                <td style={styles.tableCell}>{asset.available}</td>
                <td style={styles.tableCell}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={styles.actionButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = styles.actionButtonHover.backgroundColor
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = styles.actionButton.backgroundColor
                      }}
                    >
                      Supply
                    </button>
                    <button
                      style={styles.actionButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = styles.actionButtonHover.backgroundColor
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = styles.actionButton.backgroundColor
                      }}
                    >
                      Borrow
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

