"use client"

const styles = {
  footer: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "#061325", // Darker blue for footer
    padding: "1.5rem",
    textAlign: "center" as const,
  },
  text: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
  },
}

export function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© {new Date().getFullYear()} Kolam dApp. All rights reserved.</p>
    </footer>
  )
}

