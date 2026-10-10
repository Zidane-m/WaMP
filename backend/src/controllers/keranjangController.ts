import { Request, Response, NextFunction } from 'express';
import { keranjangParamSchema } from '../validations/authValidation';
import * as keranjangService from '../services/keranjangService';

export async function getKeranjang(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id_pengguna;
    const summary = await keranjangService.getKeranjang(userId);

    res.status(200).json({
      message: 'Daftar keranjang berhasil diambil',
      data: summary
    });
  } catch (error) {
    next(error);
  }
}

export async function tambahKeranjang(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id_pengguna;
    const { id_barang } = keranjangParamSchema.parse(req.params);
    const result = await keranjangService.tambahKeranjang(userId, id_barang);

    res.status(201).json({
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

export async function hapusKeranjang(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id_pengguna;
    const { id_barang } = keranjangParamSchema.parse(req.params);
    const result = await keranjangService.hapusKeranjang(userId, id_barang);

    res.status(200).json({
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}
