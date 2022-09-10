import express from 'express';
import { createRecord, getRecords } from '../controllers/record.controller.js';

const router = express.Router();

router.post('/record', createRecord);
router.get('/records', getRecords);

export default router;