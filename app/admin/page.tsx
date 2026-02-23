"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
    _count: {
        applications: number
    }
}

interface Application {
    id: string
    status: string
    createdAt: string
    user: {
        name: string | null
        email: string
    }
    jobPosting: {
        title: string
    } | null
}

export default function AdminPage() {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            redirect("/auth/signin")
            return
        }

        // Check if user is admin
        fetch("/api/admin/check")
            .then((res) => res.json())
            .then((data) => {
                if (!data.isAdmin) {
                    redirect("/dashboard")
                    return
                }

                Promise.all([
                    fetch("/api/admin/users").then((r) => r.json()),
                    fetch("/api/admin/applications").then((r) => r.json()),
                ]).then(([usersData, appsData]) => {
                    setUsers(usersData)
                    setApplications(appsData)
                    setLoading(false)
                })
            })
            .catch(() => setLoading(false))
    }, [session, status])

    if (loading || status === "loading") {
        return <div className="container mx-auto px-4 py-20 text-center">Зареждане...</div>
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Admin панел</h1>

            <div className="grid gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Статистика</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-2xl font-bold">{users.length}</p>
                                <p className="text-muted-foreground">Общо потребители</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{applications.length}</p>
                                <p className="text-muted-foreground">Общо кандидатури</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {users.filter((u) => u.role === "admin").length}
                                </p>
                                <p className="text-muted-foreground">Администратори</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Потребители</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {users.map((user) => (
                                <div key={user.id} className="border-b pb-4">
                                    <p className="font-semibold">{user.name || user.email}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Кандидатури: {user._count.applications} • Роля: {user.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Последни кандидатури</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {applications.map((app) => (
                                <div key={app.id} className="border-b pb-4">
                                    <p className="font-semibold">
                                        {app.jobPosting?.title || "Без заглавие"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {app.user.name || app.user.email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Статус: {app.status} • {new Date(app.createdAt).toLocaleDateString("bg-BG")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
