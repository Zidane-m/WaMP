import { Router } from 'express';
import {
  getBarang,
  getBarangDetail,
  createBarang,
  updateBarang,
  deleteBarang
} from '../controllers/barangController';
import { uploadSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getBarang);
router.get('/:id', getBarangDetail);
router.post('/', uploadSingleImage, createBarang);
router.put('/:id', uploadSingleImage, updateBarang);
router.delete('/:id', deleteBarang);

export default router;
