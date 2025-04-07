const styles = {
  container: {
    backgroundColor: "#111111",
    border: "1px solid #222222",
    borderRadius: "0.5rem",
    padding: "1.5rem",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "1rem",
  },
  processContainer: {
    marginTop: "2rem",
    padding: "1.25rem",
    backgroundColor: "#1a1a1a",
    borderRadius: "0.5rem",
    borderLeft: "4px solid #ff6b00",
  },
  processHeading: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "0.5rem",
  },
  list: {
    listStyleType: "decimal",
    listStylePosition: "inside" as "inside", // Fixed: added type assertion
    color: "#d1d5db",
    marginLeft: "1rem",
  },
  listItem: {
    marginBottom: "0.5rem",
  },
  note: {
    marginTop: "1rem",
    color: "#ff6b00",
  },
}

export function LstInvestmentExplainer() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Investment Process</h2>

      <div style={styles.processContainer}>
        <h3 style={styles.processHeading}>How It Works</h3>
        <ol style={styles.list}>
          <li style={styles.listItem}>Select a project that matches your investment goals</li>
          <li style={styles.listItem}>Choose the amount of LST AED tokens you wish to invest</li>
          <li style={styles.listItem}>Confirm the transaction and become a project investor</li>
        </ol>
        <p style={styles.note}>
          Your invested tokens will be allocated to the selected project, with returns distributed according to the
          project terms.
        </p>
      </div>
    </div>
  )
}