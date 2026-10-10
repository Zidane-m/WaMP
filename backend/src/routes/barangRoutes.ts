import { Router } from 'express';
import {
  getBarang,
  getBarangDetail,
  getBarangSaya,
  createBarang,
  updateBarang,
  deleteBarang
} from '../controllers/barangController';
import { uploadSingleImage } from '../middleware/uploadMiddleware';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Rute barang milik pengguna yang sedang login (harus sebelum :id)
router.get('/saya', requireAuth, getBarangSaya);

router.get('/', getBarang);
router.get('/:id', getBarangDetail);
router.post('/', optionalAuth, uploadSingleImage, createBarang);
router.put('/:id', optionalAuth, uploadSingleImage, updateBarang);
router.delete('/:id', optionalAuth, deleteBarang);

export default router;
