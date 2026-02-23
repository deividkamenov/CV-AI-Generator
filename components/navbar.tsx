"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          AI Job Assistant
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Настройки
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Изход
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Вход</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
