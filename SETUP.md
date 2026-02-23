# Първоначална настройка

## Бърз старт

1. **Клонирайте и инсталирайте**:
```bash
npm install
```

2. **Настройте `.env` файл** (вижте `.env.example`)

3. **Настройте базата данни**:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. **Стартирайте development сървъра**:
```bash
npm run dev
```

## Създаване на Admin User

След seed, admin user се създава автоматично с email `admin@example.com`.

За да създадете допълнителен admin user:

```bash
# Използвайте Prisma Studio
npx prisma studio

# Или директно в базата данни:
# UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Тестване на функционалностите

### 1. Тестване на Authentication
- Отидете на `/auth/signin`
- Влезте с Google или Email
- Проверете че се създава subscription автоматично

### 2. Тестване на AI Generation
- Влезте в dashboard
- Качете CV или въведете CV текст
- Въведете обява за работа
- Генерирайте CV/Cover Letter/Interview answers
- Проверете че се записва в базата данни

### 3. Тестване на Stripe (Test Mode)
- Отидете на `/dashboard/settings`
- Click "Надгради до Pro"
- Използвайте тестова карта: `4242 4242 4242 4242`
- Проверете че subscription се обновява

### 4. Тестване на Admin Panel
- Влезте като admin user
- Отидете на `/admin`
- Проверете статистиката и списъците

## Често срещани проблеми

### Prisma Client не е генериран
```bash
npx prisma generate
```

### Database connection error
- Проверете `DATABASE_URL` в `.env`
- За PostgreSQL, проверете че сървърът работи
- За SQLite, проверете правата за запис

### NextAuth errors
- Проверете `NEXTAUTH_SECRET` е зададен
- Проверете Google OAuth credentials
- Проверете redirect URIs

### Anthropic API errors
- Проверете `ANTHROPIC_API_KEY` е валиден
- Проверете че имате достатъчно credits

### Stripe errors
- Използвайте test keys за development
- Проверете webhook secret
- Проверете Price ID е правилен

## Production Checklist

Преди deploy в production:

- [ ] Всички environment variables са зададени
- [ ] Database migrations са приложени
- [ ] Stripe webhook е конфигуриран
- [ ] Google OAuth redirect URIs са обновени
- [ ] Admin users са създадени
- [ ] Error tracking е настроен
- [ ] Backup стратегия за database
- [ ] Rate limiting е добавен (препоръчително)
- [ ] Monitoring е настроен

## Допълнителни настройки

### Rate Limiting

Препоръчително е да добавите rate limiting за API routes. Използвайте `@upstash/ratelimit` или подобен пакет.

### Error Tracking

Добавете Sentry или подобна услуга за error tracking в production.

### Analytics

Добавете Vercel Analytics или Google Analytics за tracking на usage.
