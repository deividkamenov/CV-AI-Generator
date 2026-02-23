"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

interface Application {
  id: string
  status: string
  createdAt: string
  jobPosting: {
    title: string
    company: string | null
  } | null
}

export default function HistoryPage() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch("/api/applications")
        .then((res) => res.json())
        .then((data) => {
          setApplications(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session])

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center">Зареждане...</div>
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад към Dashboard
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">История на кандидатури</h1>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Все още нямате кандидатури</p>
            <Button asChild>
              <Link href="/dashboard">Създайте първата</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {app.jobPosting?.title || "Кандидатура"}
                    </CardTitle>
                    <CardDescription>
                      {app.jobPosting?.company && `${app.jobPosting.company} • `}
                      {formatDate(app.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      app.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {app.status === "completed" ? "Завършена" : "Чернова"}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/application/${app.id}`}>Преглед</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
