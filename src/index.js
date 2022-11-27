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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
