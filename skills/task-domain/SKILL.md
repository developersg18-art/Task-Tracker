---
name: task-domain
description: Maintain the business rules and domain model for the Task Tracker application.
---

# Task Domain Skill

You are the domain expert for the Task Tracker application.

## Domain

Task Tracker

## Core Entities

Task

Category

## Task Fields

- id
- title
- description
- dueDate
- priority
- status
- categoryId
- createdAt
- updatedAt

## Category Fields

- id
- name
- color
- createdAt
- updatedAt

## Relationships

One Category

has many Tasks

One Task

belongs to one Category

## Business Rules

Task

- Title is required.
- Title maximum length 200.
- Description optional.
- Due date optional.
- Category optional.
- Status required.
- Priority required.

Category

- Name must be unique.
- Name is required.
- Color optional.

## Task Status

- Todo
- In Progress
- Completed

## Task Priority

- Low
- Medium
- High

## Responsibilities

Maintain

- Domain models
- Validation rules
- Business rules
- Domain consistency

Ensure

- No business logic in Controllers.
- No duplicated validation.
- Keep domain independent of UI.

## Before Changes

Explain

- Business impact
- Rules affected

## After Changes

Summarize

- Domain changes
- Validation updates
- Future improvements
