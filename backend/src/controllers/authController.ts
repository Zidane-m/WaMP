import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validations/authValidation';
import * as authService from '../services/authService';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);

    res.status(201).json({
      message: 'Pendaftaran akun berhasil',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);

    res.status(200).json({
      message: 'Berhasil masuk ke akun',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getMe(req.user!.id_pengguna);

    res.status(200).json({
      message: 'Profil pengguna berhasil diambil',
      data: user
    });
  } catch (error) {
    next(error);
  }
}
