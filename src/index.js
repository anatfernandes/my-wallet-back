import express from 'express';
import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import cors from 'cors';
import joi from 'joi';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('mywallet');
});

server.listen(5000, () => console.log('Listening on port 5000...'));