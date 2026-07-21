import { NotFoundError } from '../../utils/api-error';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { taskRepository } from './task.repository';
import type { CreateTaskInput, Task, UpdateTaskInput } from './task.types';

export const taskService = {
  listTasks(): Promise<Task[]> {
    return taskRepository.findAll();
  },

  async getTaskById(id: string): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND, 'TASK_NOT_FOUND');
    }
    return task;
  },

  createTask(data: CreateTaskInput): Promise<Task> {
    return taskRepository.create(data);
  },

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    await this.getTaskById(id); // ensures 404 before update
    return taskRepository.update(id, data);
  },

  async deleteTask(id: string): Promise<void> {
    await this.getTaskById(id);
    await taskRepository.delete(id);
  },
};
