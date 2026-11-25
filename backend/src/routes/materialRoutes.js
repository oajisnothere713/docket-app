import express from 'express';
import { getMaterials } from '../controllers/materialController.js';

const router = express.Router();

router.get('/', getMaterials);

export default router;
