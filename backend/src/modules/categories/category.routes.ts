import { Router, type NextFunction, type Request, type Response } from 'express';
import { asyncHandler } from '../../lib/async-handler';
import { sendSuccess } from '../../utils/api-response';
import { HTTP_STATUS } from '../../constants/http-status';
import { categoryService } from './category.service';
import { validate } from '../../middlewares/validate';
import {
  createCategorySchema,
  idParamSchema,
  updateCategorySchema,
  type CreateCategoryDto,
  type IdParamDto,
  type UpdateCategoryDto,
} from './category.validation';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.listCategories();
    return sendSuccess(res, categories);
  }),
);

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  asyncHandler<Request & { params: IdParamDto }>(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    return sendSuccess(res, category);
  }),
);

router.post(
  '/',
  validate(createCategorySchema),
  asyncHandler<Request & { body: CreateCategoryDto }>(async (req, res) => {
    const created = await categoryService.createCategory(req.body);
    return sendSuccess(res, created, HTTP_STATUS.CREATED);
  }),
);

router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateCategorySchema),
  asyncHandler<Request & { params: IdParamDto; body: UpdateCategoryDto }>(async (req, res) => {
    const updated = await categoryService.updateCategory(req.params.id, req.body);
    return sendSuccess(res, updated);
  }),
);

router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  asyncHandler<Request & { params: IdParamDto }>(async (req, res, next: NextFunction) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
    next();
  }),
);

export { router as categoryRouter };
