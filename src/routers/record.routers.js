import express from 'express';
import { createRecord, deleteRecord, getRecords } from '../controllers/record.controller.js';
import hasUserMiddleware from '../middlewares/auth.middleware.js';
import { recordSchemaMiddleware } from '../middlewares/schemas.middleware.js';

const router = express.Router();

router.use(hasUserMiddleware);

router.post('/record', recordSchemaMiddleware, createRecord);
router.get('/records', getRecords);
router.delete('/records/:idRecord', deleteRecord);

export default router;