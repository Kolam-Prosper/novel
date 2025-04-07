"use client"

import { useState } from "react"

// Sample project data
const initialProjects = [
  {
    id: 1,
    name: "Gold Transportation",
    apy: "18%",
    minInvestment: "$5,000",
    riskLevel: "Medium",
    available: "$2.5M",
    duration: "12 months",
    description: "Investment in gold transportation infrastructure and logistics between UAE and India.",
    invested: false,
  },
  {
    id: 2,
    name: "Farming Expansion",
    apy: "15%",
    minInvestment: "$2,500",
    riskLevel: "Medium-Low",
    available: "$1.8M",
    duration: "24 months",
    description: "Expansion of agricultural operations in the UAE with focus on sustainable farming practices.",
    invested: false,
  },
  {
    id: 3,
    name: "Rent-to-Buy Homes",
    apy: "12%",
    minInvestment: "$10,000",
    riskLevel: "Low",
    available: "$5M",
    duration: "36 months",
    description: "Residential property development with rent-to-buy options for first-time homeowners.",
    invested: false,
  },
  {
    id: 4,
    name: "Commercial Property",
    apy: "20%",
    minInvestment: "$25,000",
    riskLevel: "Medium-High",
    available: "$8M",
    duration: "18 months",
    description: "Investment in prime commercial real estate in Dubai's business districts.",
    invested: false,
  },
]

const styles = {
  container: {
    backgroundColor: "#111111",
    border: "1px solid #222222",
    borderRadius: "0.5rem",
    padding: "1rem",
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableHead: {
    textAlign: "left" as const,
  },
  tableHeadCell: {
    padding: "0.75rem 1rem",
    color: "#a0aec0",
    fontWeight: "500",
  },
  tableRow: {
    borderTop: "1px solid #222222",
  },
  tableRowHover: {
    backgroundColor: "#1a1a1a",
  },
  tableCell: {
    padding: "1rem",
    color: "#ffffff",
  },
  tableCellWhite: {
    padding: "1rem",
    color: "#ffffff",
    fontWeight: "500",
  },
  tableCellOrange: {
    padding: "1rem",
    color: "#ff6b00",
    fontWeight: "500",
  },
  investButton: {
    backgroundColor: "#ff6b00",
    color: "white",
    padding: "0.25rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.875rem",
    transition: "background-color 0.2s",
  },
  investButtonHover: {
    backgroundColor: "#e05e00",
  },
  investedButton: {
    backgroundColor: "#059669",
    color: "white",
    padding: "0.25rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.875rem",
  },
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "1rem",
  },
  modalContent: {
    backgroundColor: "#111111",
    borderRadius: "0.5rem",
    maxWidth: "28rem",
    width: "100%",
    padding: "1.5rem",
    border: "1px solid #222222",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "0.5rem",
  },
  modalDescription: {
    color: "#d1d5db",
    marginBottom: "1rem",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1rem",
  },
  modalLabel: {
    color: "#a0aec0",
    fontSize: "0.875rem",
  },
  modalValue: {
    color: "#ffffff",
  },
  modalValueOrange: {
    color: "#ff6b00",
    fontWeight: "500",
  },
  inputLabel: {
    display: "block",
    color: "#a0aec0",
    marginBottom: "0.25rem",
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    color: "#ffffff",
  },
  buttonContainer: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#ff6b00",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  confirmButtonHover: {
    backgroundColor: "#e05e00",
  },
  confirmButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as const,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid #333333",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  cancelButtonHover: {
    backgroundColor: "#1a1a1a",
  },
}

export function LstProjectsTable() {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedProject, setSelectedProject] = useState<(typeof initialProjects)[0] | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Handle opening the investment modal
  const handleOpenInvestModal = (project: (typeof initialProjects)[0]) => {
    setSelectedProject(project)
    setInvestmentAmount("")
  }

  // Handle closing the investment modal
  const handleCloseInvestModal = () => {
    setSelectedProject(null)
    setInvestmentAmount("")
  }

  // Handle investment submission
  const handleInvest = () => {
    if (!selectedProject || !investmentAmount || Number.parseFloat(investmentAmount) <= 0) {
      alert("Please enter a valid investment amount")
      return
    }

    setIsInvesting(true)

    // Simulate investment process
    setTimeout(() => {
      // Update project as invested
      setProjects(
        projects.map((project) => (project.id === selectedProject.id ? { ...project, invested: true } : project)),
      )

      setIsInvesting(false)
      setSelectedProject(null)
      setInvestmentAmount("")

      alert(`Successfully invested in ${selectedProject.name}!`)
    }, 1500)
  }

  return (
    <div>
      <div style={styles.container}>
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeadCell}>Project</th>
              <th style={styles.tableHeadCell}>APY</th>
              <th style={styles.tableHeadCell}>Min Investment</th>
              <th style={styles.tableHeadCell}>Risk Level</th>
              <th style={styles.tableHeadCell}>Available</th>
              <th style={styles.tableHeadCell}>Duration</th>
              <th style={styles.tableHeadCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                style={{
                  ...styles.tableRow,
                  ...(hoveredRow === project.id ? styles.tableRowHover : {}),
                }}
                onMouseEnter={() => setHoveredRow(project.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.tableCellWhite}>{project.name}</td>
                <td style={styles.tableCellOrange}>{project.apy}</td>
                <td style={styles.tableCell}>{project.minInvestment}</td>
                <td style={styles.tableCell}>{project.riskLevel}</td>
                <td style={styles.tableCell}>{project.available}</td>
                <td style={styles.tableCell}>{project.duration}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => handleOpenInvestModal(project)}
                    style={
                      project.invested
                        ? styles.investedButton
                        : {
                            ...styles.investButton,
                            ...(hoveredButton === `invest-${project.id}` ? styles.investButtonHover : {}),
                          }
                    }
                    onMouseEnter={() => setHoveredButton(`invest-${project.id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    {project.invested ? "Invested" : "Invest"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Investment Modal */}
      {selectedProject && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Invest in {selectedProject.name}</h3>
            <p style={styles.modalDescription}>{selectedProject.description}</p>

            <div style={styles.modalGrid}>
              <div>
                <p style={styles.modalLabel}>APY</p>
                <p style={styles.modalValueOrange}>{selectedProject.apy}</p>
              </div>
              <div>
                <p style={styles.modalLabel}>Duration</p>
                <p style={styles.modalValue}>{selectedProject.duration}</p>
              </div>
              <div>
                <p style={styles.modalLabel}>Min Investment</p>
                <p style={styles.modalValue}>{selectedProject.minInvestment}</p>
              </div>
              <div>
                <p style={styles.modalLabel}>Risk Level</p>
                <p style={styles.modalValue}>{selectedProject.riskLevel}</p>
              </div>
            </div>

            <div>
              <label style={styles.inputLabel}>Investment Amount (LST)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                style={styles.input}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>

            <div style={styles.buttonContainer}>
              <button
                onClick={handleInvest}
                disabled={isInvesting || !investmentAmount}
                style={{
                  ...styles.confirmButton,
                  ...(hoveredButton === "confirm" ? styles.confirmButtonHover : {}),
                  ...(isInvesting || !investmentAmount ? styles.confirmButtonDisabled : {}),
                }}
                onMouseEnter={() => setHoveredButton("confirm")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {isInvesting ? "Processing..." : "Confirm Investment"}
              </button>
              <button
                onClick={handleCloseInvestModal}
                disabled={isInvesting}
                style={{
                  ...styles.cancelButton,
                  ...(hoveredButton === "cancel" ? styles.cancelButtonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("cancel")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

