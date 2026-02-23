import Anthropic from '@anthropic-ai/sdk'

export function getAnthropicClient(apiKey?: string) {
  return new Anthropic({
    apiKey: apiKey || process.env.ANTHROPIC_API_KEY || '',
  })
}

export async function generateCV(
  cvContent: string,
  jobPosting: string,
  language: 'bg' | 'en' = 'bg',
  customApiKey?: string
): Promise<string> {
  const anthropic = getAnthropicClient(customApiKey)
  const systemPrompt = language === 'bg'
    ? `Ти си експерт по писане на CV и кандидатстване за работа. Генерирай ATS-friendly CV на базата на предоставеното CV и обявата за работа. CV-то трябва да бъде структурирано, професионално и оптимизирано за автоматизирани системи за подбор. Използвай ключови думи от обявата.`
    : `You are an expert at writing CVs and job applications. Generate an ATS-friendly CV based on the provided CV and job posting. The CV should be structured, professional, and optimized for automated recruitment systems. Use keywords from the job posting.`

  const userPrompt = language === 'bg'
    ? `Генерирай CV на базата на следното съдържание:\n\n${cvContent}\n\nИ обявата за работа:\n\n${jobPosting}\n\nCV-то трябва да бъде на ${language === 'bg' ? 'български' : 'английски'} език, структурирано и готово за използване.`
    : `Generate a CV based on the following content:\n\n${cvContent}\n\nAnd the job posting:\n\n${jobPosting}\n\nThe CV should be in ${language === 'bg' ? 'Bulgarian' : 'English'}, structured and ready to use.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  } catch (error) {
    console.error('Anthropic API error:', error)
    throw new Error(`Грешка при извикване на AI API: ${error instanceof Error ? error.message : 'Неизвестна грешка'}`)
  }
}

export async function generateCoverLetter(
  cvContent: string,
  jobPosting: string,
  language: 'bg' | 'en' = 'bg',
  customApiKey?: string
): Promise<string> {
  const anthropic = getAnthropicClient(customApiKey)
  const systemPrompt = language === 'bg'
    ? `Ти си експерт по писане на мотивационни писма. Генерирай професионално мотивационно писмо на 1 страница, което е персонализирано за конкретната обява за работа.`
    : `You are an expert at writing cover letters. Generate a professional 1-page cover letter that is personalized for the specific job posting.`

  const userPrompt = language === 'bg'
    ? `Генерирай мотивационно писмо на базата на следното CV:\n\n${cvContent}\n\nИ обявата за работа:\n\n${jobPosting}\n\nПисмото трябва да бъде на ${language === 'bg' ? 'български' : 'английски'} език, професионално и персонализирано.`
    : `Generate a cover letter based on the following CV:\n\n${cvContent}\n\nAnd the job posting:\n\n${jobPosting}\n\nThe letter should be in ${language === 'bg' ? 'Bulgarian' : 'English'}, professional and personalized.`

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

export async function generateInterviewAnswers(
  cvContent: string,
  jobPosting: string,
  language: 'bg' | 'en' = 'bg',
  customApiKey?: string
): Promise<string> {
  const anthropic = getAnthropicClient(customApiKey)
  const systemPrompt = language === 'bg'
    ? `Ти си експерт по подготовка за интервюта. Генерирай отговори на типични интервю въпроси базирани на CV-то и обявата за работа.`
    : `You are an expert at interview preparation. Generate answers to common interview questions based on the CV and job posting.`

  const userPrompt = language === 'bg'
    ? `Генерирай отговори на типични интервю въпроси на базата на следното CV:\n\n${cvContent}\n\nИ обявата за работа:\n\n${jobPosting}\n\nОтговорите трябва да бъдат на ${language === 'bg' ? 'български' : 'английски'} език и да включват най-често задаваните въпроси.`
    : `Generate answers to common interview questions based on the following CV:\n\n${cvContent}\n\nAnd the job posting:\n\n${jobPosting}\n\nThe answers should be in ${language === 'bg' ? 'Bulgarian' : 'English'} and include the most frequently asked questions.`

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
