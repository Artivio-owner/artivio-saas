import { Router } from 'express';
import { ProductsController } from './products.controller';
import { authRequired } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authRequired([Role.ADMIN, Role.MANAGER]), ProductsController.list);
router.post('/', authRequired([Role.ADMIN, Role.MANAGER]), ProductsController.create);

export default router;