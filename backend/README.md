# Task Tracker — Backend

Express + TypeScript + Prisma + PostgreSQL.

## Scripts

```bash
npm install
cp .env.example .env       # then edit DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run dev                # http://localhost:3000
npm run typecheck
npm run lint
npm test
```

## Layout

```
src/
  config/         env, PrismaClient
  constants/      HTTP status, error messages
  lib/            logger, async handler
  middlewares/    validate, error handler, request logger, 404
  utils/          response helpers, AppError
  modules/
    tasks/        controller, service, repository, routes, validation, types
    categories/   same shape
  types/          express Request augmentation
  app.ts          Express app factory
  server.ts       listen
prisma/
  schema.prisma
```

Architecture: Controller → Service → Repository. Repository only place that touches Prisma.
