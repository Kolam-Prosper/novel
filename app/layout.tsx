import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kolam Prosper",
  description: "A decentralized finance platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          backgroundColor: "#000000", // Black background
          color: "#ffffff", // White text
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <Providers>
          <Sidebar />
          <main
            style={{
              flex: 1,
              marginLeft: "240px", // Match sidebar width
              minHeight: "100vh",
              boxSizing: "border-box" as const,
            }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

