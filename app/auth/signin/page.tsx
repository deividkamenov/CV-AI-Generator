"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleGoogleSignIn = () => {
    setMessage("Google вход не е конфигуриран. Моля използвайте Dashboard директно.")
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Email login is disabled - redirect to dashboard instead
    setMessage("Имейл влизането изисква SMTP конфигурация. Можете да използвате Dashboard директно без вход.")
    
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Вход
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Влезте в акаунта си или създайте нов
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>Забележка:</strong> За да използвате приложението не е нужен вход.
            Кликнете "Продължи без вход" по-долу.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Продължи с Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Или</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Имейл
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes("Проверете") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Изпраща се..." : "Продължи с имейл"}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
              Продължи без вход →
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Със създаването на акаунт се съгласявате с нашите{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Условия за ползване
            </Link>
          </p>

          <div className="text-center mt-4">
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              ← Назад към началната страница
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
