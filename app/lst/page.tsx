import { LstInvestmentExplainer } from "@/components/lst/lst-investment-explainer"
import { LstProjectsTable } from "@/components/lst/lst-projects-table"
import { LstUserInvestments } from "@/components/lst/lst-user-investments"

const styles = {
  container: {
    padding: "2rem 1rem",
  },
  heading: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "1.5rem",
  },
  section: {
    marginTop: "3rem",
  },
  sectionHeading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "1.5rem",
  },
}

export default function LstPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>LST Investment Opportunities (Example data not Live)</h1>

      {/* Explainer section */}
      <LstInvestmentExplainer />

      {/* User investments section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>Your Investment Portfolio</h2>
        <LstUserInvestments />
      </div>

      {/* Projects table */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>Available Projects</h2>
        <LstProjectsTable />
      </div>
    </div>
  )
}

