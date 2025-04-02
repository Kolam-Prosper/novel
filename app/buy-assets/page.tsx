"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, FileText, Banknote } from "lucide-react"

export default function BuyAssets() {
  const [showFaucetModal, setShowFaucetModal] = useState(false)

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "#ffffff",
          }}
        >
          Buy Assets
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#999999",
          }}
        >
          Purchase digital assets on our platform
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Property Deeds Card */}
        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: "0.5rem",
            border: "1px solid #222222",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Home size={24} color="#ff6b00" />
              Property Deeds
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#999999",
                marginBottom: "1.5rem",
              }}
            >
              Digital real estate ownership
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>Price per Deed:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>$100,000 USDC</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>Type:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>Real Estate</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>Maturity:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>18 Months</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>APY:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>20%</span>
              </div>
            </div>
          </div>

          <Link
            href="/buy-assets/property-deeds"
            style={{
              backgroundColor: "#ff6b00",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              display: "block",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e05e00"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b00"
            }}
          >
            Purchase
          </Link>
        </div>

        {/* UAE T-Bonds Card */}
        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: "0.5rem",
            border: "1px solid #222222",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FileText size={24} color="#ff6b00" />
              UAE T-Bonds
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#999999",
                marginBottom: "1.5rem",
              }}
            >
              Virtual Government Backed Securities
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>Price per Bond:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>$1,000 USDC</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>Type:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>T-Bonds</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>Maturity:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>Minimum 3 years (Perpetual)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#999999" }}>APY:</span>
                <span style={{ color: "#ffffff", fontWeight: "500" }}>3.5%</span>
              </div>
            </div>
          </div>

          <Link
            href="/buy-assets/t-bonds"
            style={{
              backgroundColor: "#ff6b00",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              display: "block",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e05e00"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b00"
            }}
          >
            Purchase
          </Link>
        </div>

        {/* Need Mock USDC Card */}
        <div
          style={{
            backgroundColor: "#111111",
            borderRadius: "0.5rem",
            border: "1px solid #222222",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Banknote size={24} color="#ff6b00" />
              Need Mock USDC?
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#999999",
                marginBottom: "1.5rem",
              }}
            >
              Get test tokens for transactions
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#ffffff", lineHeight: 1.5 }}>
                You'll need Mock USDC tokens to purchase T-Bonds and Property Deeds on the testnet platform. Get them
                for free from our faucet.
              </p>
            </div>
          </div>

          <button
            style={{
              backgroundColor: "#ff6b00",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              display: "block",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
            onClick={() => setShowFaucetModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e05e00"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b00"
            }}
          >
            Get Mock USDC
          </button>
        </div>
      </div>

      {showFaucetModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: "#111111",
              borderRadius: "0.5rem",
              border: "1px solid #222222",
              padding: "2rem",
              width: "600px",
              maxWidth: "90%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Banknote size={20} color="#ff6b00" />
                Mock USDC Faucet
              </h2>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#999999",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
                onClick={() => setShowFaucetModal(false)}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  color: "#ffffff",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Use this faucet to get Mock USDC tokens for testing purposes.
              </p>
              <iframe
                src="https://mockfaucet.vercel.app"
                style={{
                  width: "100%",
                  height: "400px",
                  border: "none",
                  borderRadius: "0.375rem",
                  backgroundColor: "#1a1a1a",
                }}
                title="Mock USDC Faucet"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

