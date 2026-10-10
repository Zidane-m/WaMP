import { Router } from 'express';
import * as keranjangController from '../controllers/keranjangController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Semua rute keranjang membutuhkan autentikasi
router.use(requireAuth);

router.get('/', keranjangController.getKeranjang);
router.post('/:id_barang', keranjangController.tambahKeranjang);
router.delete('/:id_barang', keranjangController.hapusKeranjang);

export default router;
