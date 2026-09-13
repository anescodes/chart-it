import { Router } from 'express';
import multer from 'multer';
import { analyzeCsvController } from './ai.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/v1/ai/analyze-csv (Public testing route)
router.post('/analyze-csv', upload.single('file'), analyzeCsvController);

export default router;