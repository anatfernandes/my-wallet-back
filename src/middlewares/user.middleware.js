import mongo from '../database/db.js';

const db = await mongo();

async function userExistMiddleware (req, res, next) {
    const { email } = req.body;
    let user;

    try {
        user = await db.collection('users').findOne({ email });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.locals.user = user;

    next();
}

export default userExistMiddleware;