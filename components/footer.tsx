"use client"

const styles = {
  footer: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "#061325", // Darker blue for footer
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1.5rem 1rem",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
  },
  copyright: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  link: {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
    textDecoration: "none",
    transition: "color 0.2s",
  },
  linkHover: {
    color: "#ff6b00", // Orange on hover
  },
}

export function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.copyright}>© {new Date().getFullYear()} Kolam dApp. All rights reserved.</p>

        <div style={styles.links}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={styles.link}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff6b00" // Orange on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"
            }}
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            style={styles.link}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff6b00" // Orange on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"
            }}
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}

