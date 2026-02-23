import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "AI Job Application Assistant",
  description: "AI-асистент за автоматично генериране на CV и мотивационни писма",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
