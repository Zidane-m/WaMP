import { Router } from 'express';
import { getKategori } from '../controllers/kategoriController';

const router = Router();

router.get('/', getKategori);

export default router;
