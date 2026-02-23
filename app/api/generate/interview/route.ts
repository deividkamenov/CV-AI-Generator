import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateInterviewAnswers } from "@/lib/anthropic"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { cvContent, jobPosting } = await req.json()

    if (!cvContent || !jobPosting) {
      return NextResponse.json(
        { error: "CV content and job posting are required" },
        { status: 400 }
      )
    }

    // Try to get session, but allow unauthenticated requests for testing
    const session = await getServerSession(authOptions)

    // Check if API key exists - REQUIRED for real AI generation
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
    if (!apiKey || apiKey === '' || apiKey.startsWith('sk-ant-api03-your-key-here')) {
      return NextResponse.json(
        {
          error: `ANTHROPIC_API_KEY не е конфигуриран!

ЗА РЕАЛНО AI ГЕНЕРИРАНЕ:
1. Вземете безплатен API ключ от: https://console.anthropic.com/
2. Отворете файла .env в главната папка на проекта
3. Намерете реда: # ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
4. Премахнете # и добавете вашия ключ:
   ANTHROPIC_API_KEY=sk-ant-api03-вашият-ключ-тук
5. Запазете файла и рестартирайте сървъра (Ctrl+C и npm run dev)

Вижте файла КАК_ДА_ДОБАВИТЕ_API_КЛЮЧ.txt за подробни инструкции.`
        },
        { status: 500 }
      )
    }

    // Generate interview answers with real AI
    const answers = await generateInterviewAnswers(cvContent, jobPosting, "bg", apiKey)

    // Save to database only if user is authenticated
    if (session?.user?.id) {
      try {
        const subscription = await prisma.subscription.findUnique({
          where: { userId: session.user.id },
        })

        if (subscription) {
          if (
            subscription.applicationsLimit !== -1 &&
            subscription.applicationsUsed >= subscription.applicationsLimit
          ) {
            return NextResponse.json(
              { error: "Application limit reached. Please upgrade your plan." },
              { status: 403 }
            )
          }

          const jobPostingRecord = await prisma.jobPosting.create({
            data: {
              title: "Job Posting",
              description: jobPosting,
              source: "manual",
            },
          })

          const application = await prisma.application.create({
            data: {
              userId: session.user.id,
              jobPostingId: jobPostingRecord.id,
              cvContent,
              interviewAnswers: answers,
              status: "completed",
            },
          })

          await prisma.subscription.update({
            where: { userId: session.user.id },
            data: {
              applicationsUsed: {
                increment: 1,
              },
            },
          })
        }
      } catch (dbError) {
        console.error("Database error (non-critical):", dbError)
        // Continue even if DB save fails
      }
    }

    return NextResponse.json({
      content: answers,
    })
  } catch (error) {
    console.error("Error generating interview answers:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate interview answers" },
      { status: 500 }
    )
  }
}
