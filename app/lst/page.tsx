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
  cardDescription: {
    color: "#999999",
    marginBottom: "1.5rem",
    lineHeight: "1.5",
  },
  tokensGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  tokenCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    border: "1px solid #333333",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  tokenCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
  },
  tokenHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  tokenIcon: {
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
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    color: "#ffffff",
  },
  tokenSymbol: {
    fontSize: "0.875rem",
    color: "#999999",
  },
  tokenDetails: {
    marginBottom: "1.5rem",
  },
  tokenDetail: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  tokenLabel: {
    color: "#999999",
  },
  tokenValue: {
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
}

// Mock LST data
const lstTokens = [
  {
    id: 1,
    symbol: "stETH",
    name: "Lido Staked ETH",
    provider: "Lido",
    apy: "4.8%",
    ratio: "1 ETH = 1.056 stETH",
    tvl: "$12.5B",
  },
  {
    id: 2,
    symbol: "rETH",
    name: "Rocket Pool ETH",
    provider: "Rocket Pool",
    apy: "4.2%",
    ratio: "1 ETH = 1.042 rETH",
    tvl: "$3.2B",
  },
  {
    id: 3,
    symbol: "cbETH",
    name: "Coinbase Staked ETH",
    provider: "Coinbase",
    apy: "3.9%",
    ratio: "1 ETH = 1.038 cbETH",
    tvl: "$5.7B",
  },
  {
    id: 4,
    symbol: "sfrxETH",
    name: "Frax Staked ETH",
    provider: "Frax Finance",
    apy: "4.5%",
    ratio: "1 ETH = 1.045 sfrxETH",
    tvl: "$1.8B",
  },
]

export default function LST() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Liquid Staking Tokens</h1>
        <p style={styles.subtitle}>Stake your ETH while maintaining liquidity</p>
      </header>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>What are Liquid Staking Tokens?</h2>
        <p style={styles.cardDescription}>
          Liquid Staking Tokens (LSTs) allow you to stake your ETH while still maintaining liquidity. When you stake
          with an LST provider, you receive a token that represents your staked ETH. This token can be used in DeFi
          applications while your original ETH continues to earn staking rewards.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Available LST Options</h2>

        <div style={styles.tokensGrid}>
          {lstTokens.map((token) => (
            <div
              key={token.id}
              style={styles.tokenCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.tokenCardHover)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              <div style={styles.tokenHeader}>
                <div style={styles.tokenIcon}>{token.symbol.charAt(0)}</div>
                <div style={styles.tokenInfo}>
                  <div style={styles.tokenName}>{token.name}</div>
                  <div style={styles.tokenSymbol}>by {token.provider}</div>
                </div>
              </div>

              <div style={styles.tokenDetails}>
                <div style={styles.tokenDetail}>
                  <span style={styles.tokenLabel}>APY</span>
                  <span style={styles.tokenValue}>{token.apy}</span>
                </div>
                <div style={styles.tokenDetail}>
                  <span style={styles.tokenLabel}>Exchange Ratio</span>
                  <span style={styles.tokenValue}>{token.ratio}</span>
                </div>
                <div style={styles.tokenDetail}>
                  <span style={styles.tokenLabel}>TVL</span>
                  <span style={styles.tokenValue}>{token.tvl}</span>
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
                Stake for {token.symbol}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
