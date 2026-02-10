import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authRequired } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authRequired([Role.ADMIN, Role.MANAGER]), OrdersController.list);
router.post('/', authRequired([Role.ADMIN, Role.MANAGER]), OrdersController.create);

export default router;