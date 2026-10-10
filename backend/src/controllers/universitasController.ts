import { Request, Response, NextFunction } from 'express';
import * as universitasService from '../services/universitasService';

export async function getUniversitas(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const list = await universitasService.getAllUniversitas();
    res.status(200).json({
      data: list
    });
  } catch (error) {
    next(error);
  }
}
