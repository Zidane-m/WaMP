import { Request, Response, NextFunction } from 'express';
import {
  filterBarangSchema,
  createBarangSchema,
  updateBarangSchema,
  idParamSchema
} from '../validations/barangValidation';
import * as barangService from '../services/barangService';
import { AppError } from '../middleware/errorHandler';

export async function getBarang(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters = filterBarangSchema.parse(req.query);
    const result = await barangService.getBarangList(filters);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getBarangDetail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await barangService.getBarangById(id);
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
}

export async function createBarang(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = createBarangSchema.parse(req.body);
    const newItem = await barangService.createBarang(validatedData, req.file);
    res.status(201).json({
      data: newItem,
      message: 'Barang berhasil ditambahkan'
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBarang(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const validatedData = updateBarangSchema.parse(req.body);
    const updatedItem = await barangService.updateBarang(id, validatedData, req.file);
    res.status(200).json({
      data: updatedItem,
      message: 'Barang berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBarang(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const pin = (req.body?.pin || req.headers['x-item-pin']) as string | undefined;

    if (!pin || typeof pin !== 'string' || pin.trim().length === 0) {
      throw new AppError('PIN keamanan wajib disertakan untuk menghapus barang', 400);
    }

    await barangService.deleteBarang(id, pin.trim());
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
