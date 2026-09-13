import { Router } from 'express';
import multer from 'multer';
import { analyzeCsvController } from './ai.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js'; 

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ai/analyze-csv
router.post('/analyze-csv', authenticateToken, upload.single('file'), analyzeCsvController);

export default router;