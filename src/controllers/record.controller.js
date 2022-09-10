import mongo from '../database/db.js';

const db = await mongo();


async function createRecord (req, res) {
    const { session } = res.locals;
    const { details, price, type } = req.body;

    let userRecords;

    try {
        userRecords = await db.collection('records').findOne({ user:session.userId });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    const record = {
        id: userRecords.records.length + 1,
        date: new Date().toLocaleDateString('pt-br'),
        details,
        price,
        type
    };

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

async function deleteRecord (req, res) {
    const { session } = res.locals;
    const { idRecord } = req.params;

    let data;

    try {
        data = await db.collection('records').findOne({ user:session.userId });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if (!data.records[idRecord]) return res.sendStatus(404);
    
    data.records.splice((idRecord - 1), 1);

    try {
        await db.collection('records').updateOne(
            { user:session.userId },
            { $set: { records: data.records } }
        );
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.sendStatus(200);
}

export { createRecord, getRecords, deleteRecord };