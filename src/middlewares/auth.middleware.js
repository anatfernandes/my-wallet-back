import mongo from '../database/db.js';

const db = await mongo();

async function hasUserMiddleware (req, res, next) {
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

    res.locals.session = session;

    next();
}

export default hasUserMiddleware;