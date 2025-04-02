"use client"

import Link from "next/link"
import { ConnectWallet } from "@/components/connect-wallet"
import { usePathname } from "next/navigation"

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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    height: "4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    color: "#ffffff", // White text
  },
  logoIcon: {
    height: "1.5rem",
    width: "1.5rem",
    borderRadius: "9999px",
    backgroundColor: "#ff6b00", // Orange logo
  },
  logoText: {
    fontWeight: "bold",
    fontSize: "1.125rem",
  },
  nav: {
    display: "none",
    gap: "1rem",
    "@media (min-width: 768px)": {
      display: "flex",
    },
  },
  navLink: {
    fontSize: "0.875rem",
    fontWeight: "medium",
    color: "#ffffff", // White text
    textDecoration: "none",
    transition: "color 0.2s",
  },
  navLinkHover: {
    color: "#ff6b00", // Orange on hover
  },
  navLinkActive: {
    color: "#ff6b00", // Orange for active link
    fontWeight: "600",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
}

export function Header() {
  const pathname = usePathname()

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Link href="/" style={styles.logo}>
            <div style={styles.logoIcon}></div>
            <span style={styles.logoText}>Kolam dApp</span>
          </Link>

          <nav
            style={{
              ...styles.nav,
              display: "flex", // Override media query
            }}
          >
            <Link
              href="/"
              style={{
                ...styles.navLink,
                ...(pathname === "/" ? styles.navLinkActive : {}),
              }}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              style={{
                ...styles.navLink,
                ...(pathname === "/dashboard" ? styles.navLinkActive : {}),
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              style={{
                ...styles.navLink,
                ...(pathname === "/transactions" ? styles.navLinkActive : {}),
              }}
            >
              Transactions
            </Link>
          </nav>
        </div>

        <div style={styles.rightSection}>
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}

