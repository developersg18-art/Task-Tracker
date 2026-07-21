-- Seed data — Task Tracker
-- Three rows covering each status.

INSERT INTO tasks (id, title, description, category, status, due_date, completed_at) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Set up CI pipeline',
    'Configure GitHub Actions for backend + frontend tests.',
    'DevOps',
    'todo',
    '2026-07-28',
    NULL
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Implement status transition endpoint',
    'Owns Completed Date set/clear logic.',
    'Backend',
    'in_progress',
    '2026-07-25',
    NULL
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Draft Prisma schema',
    'Single tasks table, UUID PK, Status enum.',
    'Backend',
    'completed',
    '2026-07-20',
    '2026-07-20T15:30:00Z'
  );
