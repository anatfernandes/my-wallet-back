import express from 'express';
import { createRecord, getRecords } from '../controllers/record.controller.js';
import hasUserMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(hasUserMiddleware);

router.post('/record', createRecord);
router.get('/records', getRecords);

export default router;