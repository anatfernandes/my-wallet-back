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

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

const recordSchema = joi.object({
    id: joi.number(),
    date: joi.string(),
    details: joi.string().required().max(20),
    price: joi.string().required(),
    type: joi.string().required()
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
        await db.collection('users').insertOne(newUser);
        const userData = await db.collection('users').findOne({ name, email });
        db.collection('records').insertOne({ user: userData._id, records:[] });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.status(201).send({ message:'Usuário criado.' });
});

server.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    const isValid = loginSchema.validate({ email, password }, { abortEarly: false });

    if (isValid.error) {
        const errors = isValid.error.details.map(({ message }) => message);
        return res.status(400).send({ message:errors });
    }

    let user;

    try {
        user = await db.collection('users').findOne({ email });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({ message:'Usuário e/ou senha inválida.' });
    }

    const token = uuid();

    try {
        await db.collection('sessions').insertOne({ userId: user._id, token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.status(200).send({ email, token });
});

server.post('/record', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ');
    const { details, price, type } = req.body;

    let record = {
        id: +new Date(),
        date: new Date().toLocaleDateString('pt-br'),
        details,
        price,
        type
    };

    if (!token) {
        return res.sendStatus(401);
    }

    const isValid = recordSchema.validate(record, { abortEarly: false });

    if (isValid.error) {
        const errors = isValid.error.details.map(({ message }) => message);
        return res.status(400).send({ message:errors });
    }

    let session;

    try {
        session = await db.collection('sessions').findOne({ token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if (!session) {
        return res.sendStatus(404);
    }

    let userRecords;

    try {
        userRecords = await db.collection('records').findOne({ user:session.userId });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    try {
        db.collection('records').updateOne(
            { user:session.userId },
            { $push: { records: record } }
        );
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    

    res.sendStatus(201);
});

server.get('/records', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ');

    if (!token) {
        return res.sendStatus(401);
    }
    
    let session;

    try {
        session = await db.collection('sessions').findOne({ token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if (!session) {
        return res.sendStatus(404);
    }

    let userRecords;

    try {
        userRecords = await db.collection('records').findOne({ user:session.userId });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.status(201).send(userRecords.records);
});


server.listen(5000, () => console.log('Listening on port 5000...'));