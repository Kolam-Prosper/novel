"use client"

export default function LST() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "4rem 1rem",
        textAlign: "center",
        color: "#ffffff",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        LST Page
      </h1>
      <div
        style={{
          backgroundColor: "#111111",
          borderRadius: "0.5rem",
          border: "1px solid #222222",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          🔄 Updating...
        </div>
        <p style={{ color: "#999999" }}>This page is currently being updated. Please check back later.</p>
      </div>
    </div>
  )
}

