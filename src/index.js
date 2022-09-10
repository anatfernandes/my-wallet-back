import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { SignIn, SignUp } from './controllers/auth.controller.js';
import { createRecord, getRecords } from './controllers/record.controller.js';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.post('/sign-up', SignUp);

server.post('/sign-in', SignIn);

server.post('/record', createRecord);

server.get('/records', getRecords);


server.listen(5000, () => console.log('Listening on port 5000...'));