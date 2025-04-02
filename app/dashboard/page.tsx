"use client"

import { DappInfo } from "@/components/dapp-info"

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
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
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
}

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Overview of your DeFi portfolio</p>
      </header>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Wallet Status</h2>
          <DappInfo />
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Portfolio Overview</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>$0.00</div>
              <div style={styles.statLabel}>Total Value</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>0</div>
              <div style={styles.statLabel}>Assets</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>0%</div>
              <div style={styles.statLabel}>APY</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>0</div>
              <div style={styles.statLabel}>Positions</div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Activity</h2>
          <p style={{ color: "#999999" }}>No recent activity to display</p>
        </div>
      </div>
    </div>
  )
}

