"use client"

import { ConnectWallet } from "@/components/connect-wallet"

const styles = {
  header: {
    position: "sticky" as const,
    top: 0,
    zIndex: 40,
    width: "100%",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "#061325", // Darker blue for header
  },
  container: {
    padding: "0 1.5rem",
    height: "4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}

export function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <ConnectWallet />
      </div>
    </header>
  )
}

