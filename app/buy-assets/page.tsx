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
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff",
  },
  assetsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  assetCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  assetCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
  },
  assetIcon: {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: "#333333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    fontSize: "1.5rem",
  },
  assetName: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#ffffff",
  },
  assetPrice: {
    fontSize: "1rem",
    color: "#999999",
    marginBottom: "1rem",
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

// Mock asset data
const assets = [
  { id: 1, symbol: "ETH", name: "Ethereum", price: "$1,899.25" },
  { id: 2, symbol: "BTC", name: "Bitcoin", price: "$61,245.78" },
  { id: 3, symbol: "UNI", name: "Uniswap", price: "$6.29" },
  { id: 4, symbol: "LINK", name: "Chainlink", price: "$14.56" },
]

export default function BuyAssets() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Buy Assets</h1>
        <p style={styles.subtitle}>Purchase crypto assets directly from our platform</p>
      </header>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Available Assets</h2>

        <div style={styles.assetsGrid}>
          {assets.map((asset) => (
            <div
              key={asset.id}
              style={styles.assetCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.assetCardHover)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              <div style={styles.assetIcon}>{asset.symbol.charAt(0)}</div>
              <div style={styles.assetName}>{asset.name}</div>
              <div style={styles.assetPrice}>{asset.price}</div>
              <button
                style={styles.button}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.button.backgroundColor
                }}
              >
                Buy {asset.symbol}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

