"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectWallet } from "@/components/connect-wallet"
import { useState } from "react"

// Import icons
import {
  LayoutDashboard,
  ShoppingCart,
  Coins,
  PiggyBank,
  Banknote,
  ExternalLink,
  Plus,
  AlertCircle,
} from "lucide-react"

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
  networkButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    border: "1px solid #333333",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    cursor: "pointer",
    width: "100%",
    marginBottom: "0.75rem",
    transition: "all 0.2s",
  },
  networkButtonHover: {
    backgroundColor: "#222222",
    border: "1px solid #ff6b00", // Use full shorthand instead of just borderColor
  },
  notification: {
    position: "fixed" as const,
    bottom: "1rem",
    right: "1rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    zIndex: 100,
    maxWidth: "20rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  successNotification: {
    backgroundColor: "#065f46",
    color: "#ffffff",
  },
  errorNotification: {
    backgroundColor: "#7f1d1d",
    color: "#ffffff",
  },
}

// Inline SVG Kolam pattern
const KolamLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <circle cx="50" cy="50" r="45" fill="#ff6b00" opacity="0.2" />

    {/* Outer kolam pattern */}
    <path d="M50,5 L95,50 L50,95 L5,50 Z" fill="none" stroke="white" strokeWidth="2" />

    {/* Middle kolam pattern */}
    <path d="M50,15 L85,50 L50,85 L15,50 Z" fill="none" stroke="white" strokeWidth="2" />

    {/* Inner kolam pattern */}
    <path d="M50,25 L75,50 L50,75 L25,50 Z" fill="none" stroke="white" strokeWidth="2" />

    {/* Center diamond */}
    <path d="M50,35 L65,50 L50,65 L35,50 Z" fill="#ff6b00" stroke="white" strokeWidth="1.5" />

    {/* Connecting lines */}
    <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="1" opacity="0.6" />
    <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="1" opacity="0.6" />

    {/* Decorative dots */}
    <circle cx="50" cy="5" r="3" fill="white" />
    <circle cx="95" cy="50" r="3" fill="white" />
    <circle cx="50" cy="95" r="3" fill="white" />
    <circle cx="5" cy="50" r="3" fill="white" />

    <circle cx="50" cy="15" r="2" fill="white" />
    <circle cx="85" cy="50" r="2" fill="white" />
    <circle cx="50" cy="85" r="2" fill="white" />
    <circle cx="15" cy="50" r="2" fill="white" />

    <circle cx="50" cy="25" r="1.5" fill="white" />
    <circle cx="75" cy="50" r="1.5" fill="white" />
    <circle cx="50" cy="75" r="1.5" fill="white" />
    <circle cx="25" cy="50" r="1.5" fill="white" />

    {/* Center dot */}
    <circle cx="50" cy="50" r="3" fill="white" />
  </svg>
)

export function Sidebar() {
  const pathname = usePathname()
  const [isHoveredNetwork, setIsHoveredNetwork] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/buy-assets", label: "Buy Assets", icon: ShoppingCart },
    { path: "/staking", label: "Staking", icon: Coins },
    { path: "/lend-borrow", label: "Lend/Borrow", icon: PiggyBank },
    { path: "/lst", label: "LST", icon: Banknote },
  ]

  // Function to add Unichain Sepolia network to MetaMask
  const addUnichainSepoliaNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setNotification({
        type: "error",
        message: "MetaMask is not installed. Please install MetaMask to add the network.",
      })
      setTimeout(() => setNotification(null), 5000)
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x515", // Chain ID 1301 in hexadecimal
            chainName: "Unichain Sepolia",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://sepolia.unichain.org"], // Correct RPC URL
            blockExplorerUrls: ["https://sepolia.uniscan.org"], // Using a placeholder explorer URL, update if needed
          },
        ],
      })

      setNotification({
        type: "success",
        message: "Unichain Sepolia network added successfully!",
      })
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      console.error("Error adding Unichain Sepolia network:", error)
      setNotification({
        type: "error",
        message: "Failed to add Unichain Sepolia network. Please try again.",
      })
      setTimeout(() => setNotification(null), 5000)
    }
  }

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
          {navItems.map((item, index) => (
            <li key={item.path + index} style={styles.navItem}>
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

          {/* Homepage Link */}
          <li style={styles.navItem}>
            <a
              href="https://www.kol.am"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                color: "#999999",
                textDecoration: "none",
                transition: "all 0.2s",
                borderLeft: "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1a1a"
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "#999999"
              }}
            >
              <ExternalLink style={{ width: "1.25rem", height: "1.25rem" }} />
              <span>Return to Homepage</span>
            </a>
          </li>
        </ul>
      </nav>

      <div style={styles.footer}>
        <button
          style={{
            ...styles.networkButton,
            ...(isHoveredNetwork ? styles.networkButtonHover : {}),
          }}
          onClick={addUnichainSepoliaNetwork}
          onMouseEnter={() => setIsHoveredNetwork(true)}
          onMouseLeave={() => setIsHoveredNetwork(false)}
        >
          <Plus size={16} />
          <span>Add Unichain Sepolia</span>
        </button>
        <ConnectWallet />
      </div>

      {/* Notification */}
      {notification && (
        <div
          style={{
            ...styles.notification,
            ...(notification.type === "success" ? styles.successNotification : styles.errorNotification),
          }}
        >
          {notification.type === "success" ? <Plus size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}
    </aside>
  )
}

