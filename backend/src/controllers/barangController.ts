import { Request, Response, NextFunction } from 'express';
import {
  filterBarangSchema,
  createBarangSchema,
  updateBarangSchema,
  idParamSchema
} from '../validations/barangValidation';
import * as barangService from '../services/barangService';

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

export async function getBarangSaya(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id_pengguna;
    const items = await barangService.getBarangSaya(userId);
    res.status(200).json({
      data: items,
      message: 'Daftar barang saya berhasil diambil'
    });
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
    const newItem = await barangService.createBarang(validatedData, req.file, req.user);
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
    const updatedItem = await barangService.updateBarang(id, validatedData, req.file, req.user);
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

    await barangService.deleteBarang(id, pin?.trim(), req.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
