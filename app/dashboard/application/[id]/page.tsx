"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"

interface Application {
  id: string
  cvContent: string | null
  generatedCv: string | null
  coverLetter: string | null
  interviewAnswers: string | null
  status: string
  createdAt: string
  jobPosting: {
    title: string
    company: string | null
  } | null
}

export default function ApplicationPage() {
  const params = useParams()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/applications/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setApplication(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  const handleDownload = (content: string, filename: string) => {
    const doc = new jsPDF()
    const lines = doc.splitTextToSize(content, 180)
    doc.text(lines, 10, 10)
    doc.save(filename)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center">Зареждане...</div>
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Кандидатурата не е намерена</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/history">Назад към историята</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/history">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        {application.jobPosting?.title || "Кандидатура"}
      </h1>

      <div className="grid gap-6">
        {application.generatedCv && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Генерирано CV</CardTitle>
                <Button
                  onClick={() => handleDownload(application.generatedCv!, "cv.pdf")}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Изтегли
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded border">
                {application.generatedCv}
              </div>
            </CardContent>
          </Card>
        )}

        {application.coverLetter && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Мотивационно писмо</CardTitle>
                <Button
                  onClick={() => handleDownload(application.coverLetter!, "cover-letter.pdf")}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Изтегли
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded border">
                {application.coverLetter}
              </div>
            </CardContent>
          </Card>
        )}

        {application.interviewAnswers && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Интервю отговори</CardTitle>
                <Button
                  onClick={() => handleDownload(application.interviewAnswers!, "interview-answers.pdf")}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Изтегли
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded border">
                {application.interviewAnswers}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
