import { SaaSTenant } from '../saas/saas.types';

declare global {
  namespace Express {
    interface Request {
      saas?: {
        tenant: SaaSTenant;
        company: { id: string } | null;
      };
    }
  }
}