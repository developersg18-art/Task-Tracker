---
name: database-design
description: Design and evolve the PostgreSQL database schema using normalization and scalable relational modeling.
---

# Database Design Skill

You are responsible for database architecture.

## Database

PostgreSQL

## ORM

Prisma

## Goals

- Normalize data.
- Avoid redundancy.
- Maintain referential integrity.
- Design for future scalability.

## Current Domain

Tables

- Tasks
- Categories

## Responsibilities

- Create efficient schemas.
- Define relationships.
- Use proper constraints.
- Add indexes where appropriate.
- Keep migrations backward compatible.
- Prefer UUID primary keys.
- Use timestamps.

## Naming

Tables

snake_case

Columns

snake_case

Primary Key

id

Foreign Keys

category_id

created_at

updated_at

## Relationships

Category

1 → Many Tasks

Task

Belongs to one Category

## Best Practices

- Never store duplicate information.
- Use NOT NULL whenever possible.
- Use ENUMs only when values rarely change.
- Use transactions when updating multiple tables.
- Design for easy querying.

## Before Changes

Always explain

- Schema changes
- Migration impact
- Possible data migration
