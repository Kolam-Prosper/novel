"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectWallet } from "@/components/connect-wallet"

// Import icons
import { LayoutDashboard, ShoppingCart, Coins, PiggyBank, Banknote } from "lucide-react"

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
    gap: "0.75rem",
  },
  logoIcon: {
    height: "2.5rem",
    width: "2.5rem",
    backgroundColor: "#ff6b00", // Orange background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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

// Inline SVG Kolam pattern
const KolamLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Black diamond pattern with white outlines */}
    <g fill="black" stroke="white" strokeWidth="2">
      {/* Center diamond */}
      <path d="M50,30 L70,50 L50,70 L30,50 Z" />

      {/* Top diamond */}
      <path d="M50,10 L60,20 L50,30 L40,20 Z" />

      {/* Right diamond */}
      <path d="M70,50 L80,60 L70,70 L60,60 Z" />

      {/* Bottom diamond */}
      <path d="M50,70 L60,80 L50,90 L40,80 Z" />

      {/* Left diamond */}
      <path d="M30,50 L40,60 L30,70 L20,60 Z" />

      {/* Top-right diamond */}
      <path d="M60,20 L70,30 L60,40 L50,30 Z" />

      {/* Bottom-right diamond */}
      <path d="M60,60 L70,70 L60,80 L50,70 Z" />

      {/* Bottom-left diamond */}
      <path d="M40,60 L50,70 L40,80 L30,70 Z" />

      {/* Top-left diamond */}
      <path d="M40,20 L50,30 L40,40 L30,30 Z" />
    </g>

    {/* White dots in the center of each diamond */}
    <g fill="white">
      <circle cx="50" cy="50" r="2" />
      <circle cx="50" cy="20" r="2" />
      <circle cx="70" cy="50" r="2" />
      <circle cx="50" cy="80" r="2" />
      <circle cx="30" cy="50" r="2" />
      <circle cx="60" cy="30" r="2" />
      <circle cx="60" cy="70" r="2" />
      <circle cx="40" cy="70" r="2" />
      <circle cx="40" cy="30" r="2" />
    </g>
  </svg>
)

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
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
          <div style={styles.logoIcon}>
            <KolamLogo />
          </div>
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

