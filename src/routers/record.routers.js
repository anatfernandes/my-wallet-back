import express from 'express';
import { createRecord, deleteRecord, getRecords, updateRecord } from '../controllers/record.controller.js';
import hasUserMiddleware from '../middlewares/auth.middleware.js';
import { recordSchemaMiddleware } from '../middlewares/schemas.middleware.js';

const router = express.Router();

router.use(hasUserMiddleware);

router.get('/records', getRecords);
router.delete('/records/delete/:idRecord', deleteRecord);

router.use(recordSchemaMiddleware);

router.post('/record', createRecord);
router.put('/record/edit/:idRecord', updateRecord);

export default router;