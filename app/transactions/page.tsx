import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TransactionList } from "@/components/transaction-list"

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  },
  main: {
    flex: 1,
    padding: "2rem 1rem",
    backgroundColor: "#0a1929", // Dark blue background
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#ffffff", // White text
  },
  card: {
    backgroundColor: "#0d2137", // Slightly lighter blue
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
}

export default function Transactions() {
  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.title}>Transactions</h1>

          <div style={styles.card}>
            <TransactionList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

