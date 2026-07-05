import express from 'express';
import { getSchedule, getDocketById, submitDocket } from '../controllers/docketController.js';

const router = express.Router();

router.get('/', getSchedule);
router.get('/:id', getDocketById);
router.post('/:id/submit', submitDocket);

export default router;
