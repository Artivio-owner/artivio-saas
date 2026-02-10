/**
 * ============================================
 * ARTIVIO — ADMIN ROUTES
 * ============================================
 */

import { Router } from 'express';
import { authRequired } from '../auth/auth.middleware';
import { Role } from '@prisma/client';
import { CompaniesController } from './companies.controller';
import { UsersController } from './users.controller';
import { LandingsController } from './landings.controller';

const router = Router();

// Super Admin
router.get('/companies', authRequired([Role.SUPER_ADMIN]), CompaniesController.list);
router.post('/companies', authRequired([Role.SUPER_ADMIN]), CompaniesController.create);

// Users
router.get('/users', authRequired([Role.SUPER_ADMIN, Role.ADMIN]), UsersController.list);
router.post('/users', authRequired([Role.SUPER_ADMIN, Role.ADMIN]), UsersController.create);

// Landings
router.get('/landings', authRequired([Role.SUPER_ADMIN, Role.ADMIN]), LandingsController.list);
router.post('/landings', authRequired([Role.SUPER_ADMIN, Role.ADMIN]), LandingsController.save);

export default router;