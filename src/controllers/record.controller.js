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
    const idRecord = Number(req.params.idRecord);

    let data;

    try {
        data = await db.collection('records').findOne({ user:session.userId });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    const newRecords = data.records.filter(({ id }) => id !== idRecord);

    try {
        await db.collection('records').updateOne(
            { user:session.userId },
            { $set: { records: newRecords } }
        );
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.sendStatus(200);
}

async function updateRecord (req, res) {
    const { session } = res.locals;
    const { details, price, type } = req.body;
    const idRecord = Number(req.params.idRecord);

    let data;

    try {
        data = await db.collection('records').findOne({ user:session.userId });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    const records = data.records.map(record => {
        
        if (record.id === idRecord) {
            return {
                ...record,
                details: details,
                price: price,
                type: type
            }
        } else {
            return record;
        }
    });

    try {
        await db.collection('records').updateOne(
            { user:session.userId },
            { $set: { records: records } }
        );
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.sendStatus(200);
}

export { createRecord, getRecords, deleteRecord, updateRecord };