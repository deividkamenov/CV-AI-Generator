"use client"

import { useState } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const [cvText, setCvText] = useState("")
  const [jobPosting, setJobPosting] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [resultType, setResultType] = useState<"cv" | "cover-letter" | "interview" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (type: "cv" | "cover-letter" | "interview") => {
    if (!cvText.trim() || !jobPosting.trim()) {
      setError("Моля, попълнете CV и обявата за работа")
      setTimeout(() => setError(null), 3000)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setResultType(type)

    try {
      console.log("Starting generation for type:", type)
      const response = await fetch(`/api/generate/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvContent: cvText,
          jobPosting: jobPosting,
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Грешка при генериране" }))
        throw new Error(errorData.error || `Грешка ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Received data:", data)

      if (data.content) {
        setResult(data.content)
      } else if (data.text) {
        setResult(data.text)
      } else {
        setResult("Генерирано успешно! (Но няма съдържание в отговора)")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Възникна грешка при генериране"
      setError(errorMessage)
      console.error("Error generating:", err)
      // Keep error visible longer if it's about API key (it has instructions)
      const timeout = errorMessage.includes("ANTHROPIC_API_KEY") ? 30000 : 5000
      setTimeout(() => setError(null), timeout)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Добре дошли! Генерирайте CV, мотивационни писма и интервю отговори с AI.
          </p>
          <button
            onClick={() => {
              setCvText("Иван Петров\nFull Stack Developer\nСофия, България\nivan.petrov@email.com\n+359 888 123 456\n\nОПИТ:\nSenior Developer, Tech Corp (2020-настояще)\n- Разработка на React/Next.js приложения\n- Backend разработка с Node.js\n- Работа с PostgreSQL\n\nУМЕНИЯ:\n- React, Next.js, TypeScript\n- Node.js, Express\n- PostgreSQL, MongoDB")
              setJobPosting("Търсим Full Stack Developer за работа върху модерни уеб приложения.\n\nИзисквания:\n- 5+ години опит с React и Node.js\n- Опит с TypeScript\n- Познаване на PostgreSQL\n\nОтговорности:\n- Разработка на нови функционалности\n- Code review и менторство")
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            📝 Зареди примерни данни за тест
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* CV Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Вашето CV</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Качи CV (PDF или текст)
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Или въведете CV съдържание
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Въведете вашето CV тук..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Job Posting Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Обява за работа</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL на обявата
                </label>
                <input
                  type="url"
                  placeholder="https://jobs.bg/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст на обявата
                </label>
                <textarea
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  placeholder="Поставете текста на обявата за работа тук..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Генериране с AI</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={(e) => {
                e.preventDefault()
                console.log("CV button clicked")
                handleGenerate("cv")
              }}
              disabled={loading || !cvText.trim() || !jobPosting.trim()}
              className="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
              type="button"
            >
              {loading && resultType === "cv" ? "⏳ Генерира се..." : "📄 Генерирай CV"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                console.log("Cover letter button clicked")
                handleGenerate("cover-letter")
              }}
              disabled={loading || !cvText.trim() || !jobPosting.trim()}
              className="bg-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
              type="button"
            >
              {loading && resultType === "cover-letter" ? "⏳ Генерира се..." : "✉️ Генерирай Cover Letter"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                console.log("Interview button clicked")
                handleGenerate("interview")
              }}
              disabled={loading || !cvText.trim() || !jobPosting.trim()}
              className="bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
              type="button"
            >
              {loading && resultType === "interview" ? "⏳ Генерира се..." : "💬 Интервю отговори"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <strong>⚠️ Грешка:</strong> {error}
              {error.includes("ANTHROPIC_API_KEY") && (
                <div className="mt-2 text-sm">
                  <p>За реално AI генериране, моля:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Вземете API ключ от <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com</a></li>
                    <li>Създайте файл <code className="bg-gray-200 px-1 rounded">.env.local</code> в root директорията</li>
                    <li>Добавете: <code className="bg-gray-200 px-1 rounded">ANTHROPIC_API_KEY=sk-ant-вашият-ключ</code></li>
                    <li>Рестартирайте сървъра</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
              ⏳ Моля изчакайте, генерира се...
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {resultType === "cv" && "Генерирано CV"}
                {resultType === "cover-letter" && "Генерирано мотивационно писмо"}
                {resultType === "interview" && "Генерирани интервю отговори"}
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  alert("Копирано в клипборда!")
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Копирай
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                {result}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Назад към началната страница
          </Link>
        </div>
      </div>
    </div>
  )
}
