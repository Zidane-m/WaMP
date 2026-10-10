import { Request, Response, NextFunction } from 'express';
import * as kategoriService from '../services/kategoriService';

export async function getKategori(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await kategoriService.getAllKategori();
    res.status(200).json({
      data: list
    });
  } catch (error) {
    next(error);
  }
}
