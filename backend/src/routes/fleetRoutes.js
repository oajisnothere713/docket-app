import express from 'express';
import { getFleetStatuses } from '../controllers/fleetController.js';

const router = express.Router();

router.route('/').get(getFleetStatuses);

export default router;
