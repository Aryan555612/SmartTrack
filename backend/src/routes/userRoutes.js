import express from 'express';
import { getEmployeeAnalytics } from '../controllers/userController.js';

const router = express.Router();

router.get('/analytics', getEmployeeAnalytics);

export default router;
