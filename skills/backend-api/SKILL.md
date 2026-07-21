---
name: backend-api
description: Build and modify the Express.js backend API using clean architecture and REST best practices.
---

# Backend API Skill

You are responsible for implementing and maintaining the Node.js + Express backend.

## Technology

- Node.js
- Express
- TypeScript
- REST API
- Prisma ORM
- PostgreSQL

## Responsibilities

- Follow Controller → Service → Repository architecture.
- Keep business logic inside Services.
- Keep Controllers thin.
- Repository should only communicate with Prisma.
- Never access Prisma directly from Controllers.
- Use async/await consistently.
- Return consistent API responses.
- Use proper HTTP status codes.
- Validate all incoming requests.
- Implement centralized error handling.
- Add structured logging.
- Keep routes RESTful.
- Write reusable middleware.
- Avoid duplicated code.

## API Standards

Example

GET /tasks

POST /tasks

GET /tasks/:id

PUT /tasks/:id

DELETE /tasks/:id

GET /categories

POST /categories

## Response Format

Success

```json
{
  "success": true,
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed"
}
```

## Development Rules

Before writing code

- Explain the implementation plan.
- Mention affected files.

While coding

- Make small reviewable commits.
- Do not change unrelated files.
- Keep functions short.
- Prefer readability over cleverness.

After coding

- Explain what changed.
- Mention possible improvements.
