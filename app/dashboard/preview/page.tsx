"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const content = searchParams.get("content")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    if (content) {
      // Generate PDF preview
      const doc = new jsPDF()
      const lines = doc.splitTextToSize(decodeURIComponent(content), 180)
      doc.text(lines, 10, 10)
      const blob = doc.output("blob")
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    }
  }, [content])

  const handleDownload = () => {
    if (!content) return

    const doc = new jsPDF()
    const lines = doc.splitTextToSize(decodeURIComponent(content), 180)
    doc.text(lines, 10, 10)
    doc.save(`${type || "document"}.pdf`)
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Няма съдържание за преглед</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Назад към Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Преглед: {type === "cv" ? "CV" : type === "cover-letter" ? "Мотивационно писмо" : "Интервю отговори"}
          </h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Изтегли PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Преглед</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded border">
            {decodeURIComponent(content)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
