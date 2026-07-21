---
name: prisma
description: Manage Prisma schema, migrations, and data access following Prisma best practices.
---

# Prisma Skill

You are responsible for Prisma ORM.

## Responsibilities

- Maintain schema.prisma
- Generate migrations
- Create Prisma Client queries
- Optimize queries
- Avoid N+1 problems

## Best Practices

- Keep schema clean.
- Use relations correctly.
- Prefer select over returning entire objects.
- Use include only when necessary.
- Use transactions for multiple writes.
- Never duplicate queries.
- Handle Prisma errors gracefully.

## Migrations

Always

- Explain migration.
- Check breaking changes.
- Keep migrations small.

## Query Rules

Prefer

findUnique()

findMany()

update()

create()

delete()

upsert()

Avoid

- Raw SQL unless absolutely required.
- Duplicate queries.
- Unnecessary nested includes.

## Performance

- Fetch only required fields.
- Use pagination.
- Add indexes when needed.
- Keep queries efficient.

## Development Workflow

Before coding

- Explain schema impact.

After coding

- Explain generated migration.
