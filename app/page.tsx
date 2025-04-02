"use client"

import { ConnectWallet } from "@/components/connect-wallet"
import Link from "next/link"

const styles = {
  container: {
    padding: "2rem 1rem",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2.5rem",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    background: "linear-gradient(to right, #ff6b00, #ff9e00)", // Orange gradient
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  description: {
    fontSize: "1.25rem",
    marginBottom: "2.5rem",
    color: "#ffffff", // White text
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    width: "100%",
  },
  card: {
    backgroundColor: "#111111", // Black theme card
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column" as const,
    transition: "transform 0.2s, box-shadow 0.2s",
    height: "100%",
    minHeight: "250px",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.75rem",
    color: "#ffffff", // White text
  },
  cardDescription: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
    marginBottom: "1.5rem",
  },
  button: {
    backgroundColor: "#ff6b00", // Orange button
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "auto",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
  },
  buttonHover: {
    backgroundColor: "#e05e00", // Darker orange on hover
  },
}

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Kolam Prosper</h1>
          <p style={styles.description}>A comprehensive DeFi platform for the next generation of finance</p>
        </header>

        <div style={styles.cardsContainer}>
          <div
            style={styles.card}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.boxShadow = ""
            }}
          >
            <h2 style={styles.cardTitle}>Getting Started</h2>
            <p style={styles.cardDescription}>
              Connect your wallet to interact with the blockchain and explore the features of this platform.
            </p>
            <ConnectWallet />
          </div>

          <div
            style={styles.card}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.boxShadow = ""
            }}
          >
            <h2 style={styles.cardTitle}>Dashboard</h2>
            <p style={styles.cardDescription}>View your portfolio, connection status, and network information.</p>
            <Link
              href="/dashboard"
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = styles.button.backgroundColor
              }}
            >
              Go to Dashboard
            </Link>
          </div>

          <div
            style={styles.card}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.boxShadow = ""
            }}
          >
            <h2 style={styles.cardTitle}>Buy Assets</h2>
            <p style={styles.cardDescription}>Purchase crypto assets directly from our platform with ease.</p>
            <Link
              href="/buy-assets"
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = styles.button.backgroundColor
              }}
            >
              Buy Assets
            </Link>
          </div>

          <div
            style={styles.card}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.cardHover)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.boxShadow = ""
            }}
          >
            <h2 style={styles.cardTitle}>Staking</h2>
            <p style={styles.cardDescription}>Earn rewards by staking your crypto assets with competitive APYs.</p>
            <Link
              href="/staking"
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = styles.button.backgroundColor
              }}
            >
              Start Staking
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

