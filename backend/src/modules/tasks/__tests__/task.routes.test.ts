import { Status } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../../../app';
import { prisma } from '../../../config/database';

jest.mock('../../../config/database', () => {
  const task = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    $disconnect: jest.fn(),
  };
  return { prisma: task };
});

const mockedPrisma = prisma as unknown as {
  task: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const app = createApp();

const sampleTask = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'Sample',
  description: null,
  category: 'Work',
  status: Status.TODO,
  dueDate: null,
  completedAt: null,
  createdAt: new Date('2026-07-20T10:00:00Z'),
  updatedAt: new Date('2026-07-20T10:00:00Z'),
};

describe('GET /api/tasks', () => {
  it('returns 200 with tasks array', async () => {
    mockedPrisma.task.findMany.mockResolvedValueOnce([sampleTask]);
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [sampleTask] });
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns 200 with task when found', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(sampleTask);
    const res = await request(app).get(`/api/tasks/${sampleTask.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(sampleTask.id);
  });

  it('returns 404 when not found', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(null);
    const res = await request(app).get(`/api/tasks/${sampleTask.id}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 on invalid uuid', async () => {
    const res = await request(app).get('/api/tasks/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/tasks', () => {
  it('returns 201 on valid input', async () => {
    mockedPrisma.task.create.mockResolvedValueOnce(sampleTask);
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Sample', category: 'Work' });
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(sampleTask);
  });

  it('returns 400 when title missing', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_FAILED');
  });

  it('returns 400 on invalid status', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'x', status: 'WRONG' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when title too long', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'a'.repeat(201) });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('returns 200 on valid update', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(sampleTask);
    const updated = { ...sampleTask, title: 'Updated' };
    mockedPrisma.task.update.mockResolvedValueOnce(updated);
    const res = await request(app)
      .put(`/api/tasks/${sampleTask.id}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated');
  });

  it('returns 404 when task missing', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(null);
    const res = await request(app)
      .put(`/api/tasks/${sampleTask.id}`)
      .send({ title: 'x' });
    expect(res.status).toBe(404);
  });

  it('returns 400 on invalid uuid', async () => {
    const res = await request(app).put('/api/tasks/abc').send({ title: 'x' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('returns 204 on success', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(sampleTask);
    mockedPrisma.task.delete.mockResolvedValueOnce(undefined);
    const res = await request(app).delete(`/api/tasks/${sampleTask.id}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 when task missing', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(null);
    const res = await request(app).delete(`/api/tasks/${sampleTask.id}`);
    expect(res.status).toBe(404);
  });
});

describe('error handling', () => {
  it('maps Prisma P2025 to 404', async () => {
    mockedPrisma.task.findUnique.mockResolvedValueOnce(null);
    const res = await request(app).get(`/api/tasks/${sampleTask.id}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('ROUTE_NOT_FOUND');
  });
});
