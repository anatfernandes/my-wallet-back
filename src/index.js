import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouters from './routers/auth.routers.js';
import recordRouters from './routers/record.routers.js';


dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.use(authRouters);
server.use(recordRouters);

server.listen(5000, () => console.log('Listening on port 5000...'));