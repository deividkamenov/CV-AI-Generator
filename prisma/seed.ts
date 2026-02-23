import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      subscription: {
        create: {
          plan: 'pro',
          status: 'active',
          applicationsLimit: -1,
        },
      },
    },
  })

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      subscription: {
        create: {
          plan: 'free',
          status: 'free',
          applicationsLimit: 5,
        },
      },
    },
  })

  // Create sample job postings
  const job1 = await prisma.jobPosting.create({
    data: {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company Sofia',
      description: `Търсим опитен Full Stack Developer за работа върху модерни уеб приложения.

Изисквания:
- 5+ години опит с React и Node.js
- Опит с TypeScript
- Познаване на PostgreSQL
- Опит с cloud платформи (AWS/Azure)

Отговорности:
- Разработка на нови функционалности
- Code review и менторство
- Работа в agile среда

Оферта:
- Конкурентна заплата
- Хибриден режим на работа
- Допълнителни здравни застраховки`,
      requirements: 'React, Node.js, TypeScript, PostgreSQL, AWS',
      location: 'София',
      source: 'jobs.bg',
      language: 'bg',
    },
  })

  const job2 = await prisma.jobPosting.create({
    data: {
      title: 'Frontend Developer',
      company: 'Digital Agency Plovdiv',
      description: `Търсим Frontend Developer за работа върху клиентски проекти.

Изисквания:
- 3+ години опит с React/Next.js
- Познаване на Tailwind CSS
- Опит с REST APIs
- Добри комуникативни умения

Отговорности:
- Разработка на UI компоненти
- Оптимизация на производителността
- Работа с дизайнери и backend екип`,
      requirements: 'React, Next.js, Tailwind CSS, TypeScript',
      location: 'Пловдив',
      source: 'linkedin',
      language: 'bg',
    },
  })

  const job3 = await prisma.jobPosting.create({
    data: {
      title: 'DevOps Engineer',
      company: 'IT Solutions Varna',
      description: `Търсим DevOps Engineer за управление на cloud инфраструктура.

Изисквания:
- Опит с Docker и Kubernetes
- Познаване на AWS или Azure
- Опит с CI/CD pipelines
- Познаване на Linux

Отговорности:
- Поддръжка на production среда
- Автоматизация на процеси
- Мониторинг и оптимизация`,
      requirements: 'Docker, Kubernetes, AWS, CI/CD, Linux',
      location: 'Варна',
      source: 'zaplatomer',
      language: 'bg',
    },
  })

  // Create sample applications
  await prisma.application.create({
    data: {
      userId: testUser.id,
      jobPostingId: job1.id,
      cvContent: `Иван Петров
Full Stack Developer
София, България
ivan.petrov@email.com
+359 888 123 456

ОПИТ:
Senior Developer, Tech Corp (2020-настояще)
- Разработка на React/Next.js приложения
- Backend разработка с Node.js и Express
- Работа с PostgreSQL и MongoDB
- CI/CD с GitHub Actions

Developer, Startup Inc (2018-2020)
- Frontend разработка с React
- API интеграции
- Code review и тестване

УМЕНИЯ:
- React, Next.js, TypeScript
- Node.js, Express
- PostgreSQL, MongoDB
- AWS, Docker
- Git, GitHub`,
      generatedCv: 'Generated CV content...',
      coverLetter: 'Generated cover letter...',
      status: 'completed',
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
