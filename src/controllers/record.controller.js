import joi from 'joi';
import mongo from '../database/db.js';

const db = await mongo();



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