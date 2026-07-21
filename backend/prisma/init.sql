-- Task Tracker — PostgreSQL schema
-- Single table. Snake_case. UUID PK. Native ENUM for status.

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');

CREATE TABLE tasks (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    category        VARCHAR(50),
    status          task_status     NOT NULL DEFAULT 'todo',
    due_date        DATE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_tasks_status     ON tasks (status);
CREATE INDEX idx_tasks_category   ON tasks (category);
CREATE INDEX idx_tasks_due_date   ON tasks (due_date);
CREATE INDEX idx_tasks_created_at ON tasks (created_at);

-- updated_at auto-bump
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
