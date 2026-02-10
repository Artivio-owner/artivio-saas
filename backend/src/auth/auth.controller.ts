/**
 * ============================================
 * ARTIVIO — AUTH CONTROLLER
 * ============================================
 */

import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  }
}