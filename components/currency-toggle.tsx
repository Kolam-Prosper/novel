"use client"

interface CurrencyToggleProps {
  currency: "USD" | "AED"
  onCurrencyChange: (currency: "USD" | "AED") => void
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.875rem",
    color: "#999999",
    marginRight: "0.5rem",
  },
  toggleContainer: {
    display: "flex",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    padding: "2px",
  },
  toggleButton: {
    padding: "0.4rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    borderRadius: "4px",
    margin: "0 2px",
  },
  activeUSD: {
    backgroundColor: "#ff6b00",
    color: "#000000",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  inactiveUSD: {
    backgroundColor: "transparent",
    color: "#ff6b00",
  },
  activeAED: {
    backgroundColor: "#ff6b00",
    color: "#000000",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  inactiveAED: {
    backgroundColor: "transparent",
    color: "#ff6b00",
  },
}

export function CurrencyToggle({ currency, onCurrencyChange }: CurrencyToggleProps) {
  return (
    <div style={styles.container}>
      <span style={styles.label}>Currency:</span>
      <div style={styles.toggleContainer}>
        <button
          style={{
            ...styles.toggleButton,
            ...(currency === "USD" ? styles.activeUSD : styles.inactiveUSD),
          }}
          onClick={() => onCurrencyChange("USD")}
        >
          USD
        </button>
        <button
          style={{
            ...styles.toggleButton,
            ...(currency === "AED" ? styles.activeAED : styles.inactiveAED),
          }}
          onClick={() => onCurrencyChange("AED")}
        >
          AED
        </button>
      </div>
    </div>
  )
}

