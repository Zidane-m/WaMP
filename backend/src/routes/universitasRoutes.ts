import { Router } from 'express';
import { getUniversitas } from '../controllers/universitasController';

const router = Router();

router.get('/', getUniversitas);

export default router;
