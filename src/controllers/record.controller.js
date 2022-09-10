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
    const { session } = res.locals;
    const { details, price, type } = req.body;

    const record = {
        id: +new Date(),
        date: new Date().toLocaleDateString('pt-br'),
        details,
        price,
        type
    };

    const isValid = recordSchema.validate(record, { abortEarly: false });

    if (isValid.error) {
        const errors = isValid.error.details.map(({ message }) => message);
        return res.status(400).send({ message:errors });
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
    const { session } = res.locals;

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