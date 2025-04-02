"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectWallet } from "@/components/connect-wallet"

// Import icons
import { Home, LayoutDashboard, ShoppingCart, Coins, PiggyBank, Banknote } from "lucide-react"

const styles = {
  sidebar: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "240px",
    height: "100vh",
    backgroundColor: "#111111", // Slightly lighter black
    borderRight: "1px solid #222222",
    display: "flex",
    flexDirection: "column" as const,
    zIndex: 50,
  },
  header: {
    padding: "1.5rem 1rem",
    borderBottom: "1px solid #222222",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoIcon: {
    height: "2rem",
    width: "2rem",
    borderRadius: "9999px",
    backgroundColor: "#ff6b00", // Orange logo
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#ffffff",
  },
  nav: {
    padding: "1.5rem 0",
    flex: 1,
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    margin: "0.25rem 0",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#999999",
    textDecoration: "none",
    transition: "all 0.2s",
    borderLeft: "3px solid transparent",
  },
  navLinkActive: {
    color: "#ffffff",
    backgroundColor: "#1a1a1a",
    borderLeft: "3px solid #ff6b00",
  },
  navLinkHover: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
  },
  navIcon: {
    width: "1.25rem",
    height: "1.25rem",
  },
  footer: {
    padding: "1rem",
    borderTop: "1px solid #222222",
  },
}

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/buy-assets", label: "Buy Assets", icon: ShoppingCart },
    { path: "/staking", label: "Staking", icon: Coins },
    { path: "/lend-borrow", label: "Lend/Borrow", icon: PiggyBank },
    { path: "/lst", label: "LST", icon: Banknote },
  ]

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>K</div>
          <span style={styles.logoText}>Kolam Prosper</span>
        </div>
      </div>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path} style={styles.navItem}>
              <Link
                href={item.path}
                style={{
                  ...styles.navLink,
                  ...(pathname === item.path ? styles.navLinkActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.path) {
                    Object.assign(e.currentTarget.style, styles.navLinkHover)
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#999999"
                  }
                }}
              >
                <item.icon style={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={styles.footer}>
        <ConnectWallet />
      </div>
    </aside>
  )
}

