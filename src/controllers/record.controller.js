import joi from 'joi';
import mongo from '../database/db.js';

const db = await mongo();

const recordSchema = joi.object({
    id: joi.number(),
    date: joi.string(),
    details: joi.string().required().max(20),
    price: joi.string().required(),
    type: joi.string().required()
});

async function createRecord (req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
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
}

async function getRecords (req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

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
}

export { createRecord, getRecords };