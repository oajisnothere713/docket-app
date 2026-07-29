import express from 'express';
import { getSchedule, getDocketById, submitDocket, startDocket } from '../controllers/docketController.js';

const router = express.Router();

router.get('/', getSchedule);
router.get('/:id', getDocketById);
router.post('/:id/submit', submitDocket);
router.post('/:id/start', startDocket);

export default router;
