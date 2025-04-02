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
  stakingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  stakingCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    border: "1px solid #333333",
  },
  stakingHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  stakingIcon: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    backgroundColor: "#333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1rem",
    fontSize: "1.25rem",
  },
  stakingInfo: {
    flex: 1,
  },
  stakingName: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    color: "#ffffff",
  },
  stakingApy: {
    fontSize: "0.875rem",
    color: "#ff6b00", // Orange
  },
  stakingDetails: {
    marginBottom: "1.5rem",
  },
  stakingDetail: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  stakingLabel: {
    color: "#999999",
  },
  stakingValue: {
    color: "#ffffff",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#ff6b00", // Orange button
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
    width: "100%",
    textAlign: "center" as const,
  },
  buttonHover: {
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
    gridTemplateColumns: "repeat(3, 1fr)",
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

// Mock staking options
const stakingOptions = [
  {
    id: 1,
    symbol: "ETH",
    name: "Ethereum",
    apy: "5.2%",
    lockPeriod: "Flexible",
    minStake: "0.1 ETH",
    totalStaked: "125,000 ETH",
  },
  {
    id: 2,
    symbol: "UNI",
    name: "Uniswap",
    apy: "8.7%",
    lockPeriod: "30 days",
    minStake: "10 UNI",
    totalStaked: "2.5M UNI",
  },
  {
    id: 3,
    symbol: "LINK",
    name: "Chainlink",
    apy: "6.5%",
    lockPeriod: "60 days",
    minStake: "5 LINK",
    totalStaked: "750,000 LINK",
  },
]

export default function Staking() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Staking</h1>
        <p style={styles.subtitle}>Earn rewards by staking your crypto assets</p>
      </header>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Your Staking Overview</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>$0.00</div>
            <div style={styles.statLabel}>Total Staked</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>$0.00</div>
            <div style={styles.statLabel}>Total Rewards</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>0</div>
            <div style={styles.statLabel}>Active Positions</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Staking Options</h2>

        <div style={styles.stakingGrid}>
          {stakingOptions.map((option) => (
            <div key={option.id} style={styles.stakingCard}>
              <div style={styles.stakingHeader}>
                <div style={styles.stakingIcon}>{option.symbol.charAt(0)}</div>
                <div style={styles.stakingInfo}>
                  <div style={styles.stakingName}>{option.name}</div>
                  <div style={styles.stakingApy}>APY: {option.apy}</div>
                </div>
              </div>

              <div style={styles.stakingDetails}>
                <div style={styles.stakingDetail}>
                  <span style={styles.stakingLabel}>Lock Period</span>
                  <span style={styles.stakingValue}>{option.lockPeriod}</span>
                </div>
                <div style={styles.stakingDetail}>
                  <span style={styles.stakingLabel}>Min Stake</span>
                  <span style={styles.stakingValue}>{option.minStake}</span>
                </div>
                <div style={styles.stakingDetail}>
                  <span style={styles.stakingLabel}>Total Staked</span>
                  <span style={styles.stakingValue}>{option.totalStaked}</span>
                </div>
              </div>

              <button
                style={styles.button}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.button.backgroundColor
                }}
              >
                Stake {option.symbol}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

