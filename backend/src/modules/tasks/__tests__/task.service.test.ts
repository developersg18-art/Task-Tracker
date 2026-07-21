import { Status } from '@prisma/client';
import { taskService } from './task.service';
import { taskRepository } from './task.repository';
import { NotFoundError } from '../../utils/api-error';

jest.mock('./task.repository', () => ({
  taskRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedRepo = taskRepository as jest.Mocked<typeof taskRepository>;

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

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTasks', () => {
    it('returns all tasks from repository', async () => {
      mockedRepo.findAll.mockResolvedValueOnce([sampleTask]);
      const result = await taskService.listTasks();
      expect(result).toEqual([sampleTask]);
      expect(mockedRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTaskById', () => {
    it('returns task when found', async () => {
      mockedRepo.findById.mockResolvedValueOnce(sampleTask);
      const result = await taskService.getTaskById(sampleTask.id);
      expect(result).toEqual(sampleTask);
    });

    it('throws NotFoundError when missing', async () => {
      mockedRepo.findById.mockResolvedValueOnce(null);
      await expect(taskService.getTaskById(sampleTask.id)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('createTask', () => {
    it('delegates to repository', async () => {
      const input = { title: 'New', category: 'Work' };
      mockedRepo.create.mockResolvedValueOnce(sampleTask);
      const result = await taskService.createTask(input);
      expect(result).toEqual(sampleTask);
      expect(mockedRepo.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateTask', () => {
    it('updates existing task', async () => {
      mockedRepo.findById.mockResolvedValueOnce(sampleTask);
      const updated = { ...sampleTask, title: 'Updated' };
      mockedRepo.update.mockResolvedValueOnce(updated);
      const result = await taskService.updateTask(sampleTask.id, { title: 'Updated' });
      expect(result).toEqual(updated);
    });

    it('throws NotFoundError when task missing', async () => {
      mockedRepo.findById.mockResolvedValueOnce(null);
      await expect(taskService.updateTask(sampleTask.id, { title: 'x' })).rejects.toBeInstanceOf(
        NotFoundError,
      );
      expect(mockedRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('deletes existing task', async () => {
      mockedRepo.findById.mockResolvedValueOnce(sampleTask);
      mockedRepo.delete.mockResolvedValueOnce(undefined);
      await expect(taskService.deleteTask(sampleTask.id)).resolves.toBeUndefined();
      expect(mockedRepo.delete).toHaveBeenCalledWith(sampleTask.id);
    });

    it('throws NotFoundError when task missing', async () => {
      mockedRepo.findById.mockResolvedValueOnce(null);
      await expect(taskService.deleteTask(sampleTask.id)).rejects.toBeInstanceOf(NotFoundError);
      expect(mockedRepo.delete).not.toHaveBeenCalled();
    });
  });
});
