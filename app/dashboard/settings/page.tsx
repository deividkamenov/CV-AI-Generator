"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Key } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<any>(null)
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch("/api/user/subscription")
        .then((res) => res.json())
        .then((data) => {
          setSubscription(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session])

  const handleUpgrade = () => {
    // Redirect to Stripe checkout
    window.location.href = "/api/stripe/checkout"
  }

  const handleSaveApiKey = async () => {
    await fetch("/api/user/api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    })
    alert("API ключът е запазен")
  }

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

      <h1 className="text-3xl font-bold mb-8">Настройки</h1>

      <div className="grid gap-6">
        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Абонамент
            </CardTitle>
            <CardDescription>
              Управление на вашия план и фактуриране
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Текущ план: {subscription?.plan || "free"}</p>
              <p className="text-sm text-muted-foreground">
                Използвани кандидатури: {subscription?.applicationsUsed || 0} /{" "}
                {subscription?.applicationsLimit === -1
                  ? "∞"
                  : subscription?.applicationsLimit || 5}
              </p>
            </div>
            {subscription?.plan === "free" && (
              <Button onClick={handleUpgrade}>Надгради до Pro</Button>
            )}
            {subscription?.plan === "pro" && (
              <Button variant="outline" onClick={() => window.location.href = "/api/stripe/portal"}>
                Управление на абонамент
              </Button>
            )}
          </CardContent>
        </Card>

        {/* API Key Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API ключ (по избор)
            </CardTitle>
            <CardDescription>
              Използвайте свой Anthropic API ключ вместо общия
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key">Anthropic API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSaveApiKey}>Запази</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
