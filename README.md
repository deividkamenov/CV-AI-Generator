## AI Job Application Assistant (CV Generator)

Full‑stack SaaS web application that helps candidates for the Bulgarian job market generate **CV**, **cover letter** and **interview preparation** content using AI.

The app is built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS (shadcn/ui)**, **Prisma**, **NextAuth**, **Anthropic Claude API** and **Stripe**.

### Features

- **AI‑assisted job applications**: generate tailored CVs, cover letters and interview answers for each job posting.
- **Authentication & accounts**: Google OAuth + email/password login via NextAuth.
- **Dashboard**: manage job postings, generated applications and history.
- **Subscriptions & billing**: Freemium + Pro plans powered by Stripe.
- **Admin panel**: manage users, subscriptions and usage.
- **PDF export**: export generated CVs and letters as PDFs.

### Tech stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Prisma ORM with PostgreSQL / SQLite
- **Auth**: NextAuth.js
- **AI**: Anthropic Claude API
- **Payments**: Stripe

### Project structure

Key folders:

- `app/` – routes (landing page, dashboard, auth, admin) and API routes
- `components/` – UI and shared components (shadcn/ui)
- `lib/` – Prisma client, auth setup, AI and Stripe helpers
- `prisma/` – `schema.prisma` and seed data
- `types/` – TypeScript augmentation for NextAuth, etc.

More details are available in `PROJECT_SUMMARY.md`, `SETUP.md`, `SETUP_API_KEY.md`, `QUICK_START.md` and `DEPLOY.md`.

### Getting started

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Create a `.env` file (not committed to Git) with values appropriate for your setup. Typical variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.

You can keep a safe, shareable example in `.env.example` with placeholder values.

3. **Set up the database**

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. **Run the development server**

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Deployment

The app is optimized for deployment on **Vercel** with a managed PostgreSQL database (or another compatible provider).

- Follow the detailed steps in `DEPLOY.md`.
- Configure all secrets as environment variables in your hosting provider.

### Notes for portfolio use

- Build artifacts (`.next`) and dependencies (`node_modules`) are **not** included and are re‑created locally via `npm install` and `npm run build`.
- Secret values stay only in your local `.env` and in your hosting provider’s environment settings.

