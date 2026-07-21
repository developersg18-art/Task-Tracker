# ER Diagram — Task Tracker

## Notes

- Single-table design. `CLAUDE.md` defines `category` as free-form string on Task, so no `Categories` table. `database-design` skill suggests 1:M relation; rejected because category is a tag, not an entity needing its own lifecycle.
- If categories later need management (rename, merge, per-user lists), introduce `categories` table + FK. Migration impact: add `categories` table, backfill distinct values, swap `tasks.category` text for `category_id` FK. Out of scope for now.

## Diagram

```
+--------------------------------------------------+
| tasks                                            |
+--------------------------------------------------+
| id              UUID          PK                 |
| title           VARCHAR(200)  NOT NULL           |
| description     TEXT          NULL               |
| category        VARCHAR(50)   NULL               |
| status          task_status   NOT NULL DEFAULT    |
|                               'todo'             |
| due_date        DATE          NULL               |
| created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()|
| updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()|
| completed_at    TIMESTAMPTZ   NULL               |
+--------------------------------------------------+

ENUM: task_status ('todo', 'in_progress', 'completed')
```

## Relationships

None. Single entity.

## Indexes

- `idx_tasks_status` on `status` — filter by status column.
- `idx_tasks_category` on `category` — filter/group by category.
- `idx_tasks_due_date` on `due_date` — sort/filter by due date.
- `idx_tasks_created_at` on `created_at` — default sort.

## Constraints

- `id` PRIMARY KEY (UUID v4).
- `title` NOT NULL, max 200 chars.
- `status` NOT NULL, default `todo`.
- `completed_at` NULL when status != `completed`, NOT NULL when `completed`. Enforced in app layer (no CHECK constraint — keeps migration simple if rules evolve).

## Triggers

- `set_updated_at` — BEFORE UPDATE: `NEW.updated_at = now()`.
