import express from 'express';
import { getMessages, sendMessage, markMessageRead } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', sendMessage);
router.patch('/:id/read', markMessageRead);

export default router;
