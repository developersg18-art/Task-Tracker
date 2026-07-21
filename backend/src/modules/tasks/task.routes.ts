import { Router, type Request, type Response, type NextFunction } from 'express';
import { asyncHandler } from '../../lib/async-handler';
import { sendSuccess } from '../../utils/api-response';
import { HTTP_STATUS } from '../../constants/http-status';
import { taskService } from './task.service';
import { validate } from '../../middlewares/validate';
import {
  createTaskSchema,
  idParamSchema,
  updateTaskSchema,
  type CreateTaskDto,
  type IdParamDto,
  type UpdateTaskDto,
} from './task.validation';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const tasks = await taskService.listTasks();
    return sendSuccess(res, tasks);
  }),
);

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  asyncHandler<Request & { params: IdParamDto }>(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    return sendSuccess(res, task);
  }),
);

router.post(
  '/',
  validate(createTaskSchema),
  asyncHandler<Request & { body: CreateTaskDto }>(async (req, res) => {
    const created = await taskService.createTask(req.body);
    return sendSuccess(res, created, HTTP_STATUS.CREATED);
  }),
);

router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateTaskSchema),
  asyncHandler<Request & { params: IdParamDto; body: UpdateTaskDto }>(async (req, res) => {
    const updated = await taskService.updateTask(req.params.id, req.body);
    return sendSuccess(res, updated);
  }),
);

router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  asyncHandler<Request & { params: IdParamDto }>(async (req, res, next: NextFunction) => {
    await taskService.deleteTask(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
    next();
  }),
);

export { router as taskRouter };
