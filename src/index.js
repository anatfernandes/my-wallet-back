import express from 'express';
import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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


const userSchema = joi.object({
    name: joi.string().required().max(30),
    email: joi.string().email().required(),
    password: joi.string().required()
});


server.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;

    const user = {
        name,
        email,
        password
    }

    const isValid = userSchema.validate(user, { abortEarly: false });

    if (isValid.error) {
        const errors = isValid.error.details.map(({ message }) => message);
        return res.status(400).send({ message:errors });
    }

    let hasUser;

    try {
        hasUser = await db.collection('users').findOne({ email });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if (hasUser) {
        return res.status(409).send({ message:'Usuário já existe.' });
    }

    const hashPassword = bcrypt.hashSync(password, 13);
    const newUser = {
        name,
        email,
        password: hashPassword
    }

    try {
        await db.collection('').insertOne(newUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.status(201).send({ message:'Usuário criado.' });
});


server.listen(5000, () => console.log('Listening on port 5000...'));