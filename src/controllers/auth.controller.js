import mongo from '../database/db.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { stripHtml } from 'string-strip-html';

const db = await mongo();

async function SignUp (req, res) {
    const { email, password } = req.body;
    let { name } = req.body;
    const { user: hasUser } = res.locals;

    name = stripHtml(name).result.trim();

    if (hasUser) {
        return res.status(409).send({ message:'Usuário já existe.' });
    }

    const hashPassword = bcrypt.hashSync(password, 13);

    const user = {
        name,
        email,
        password: hashPassword
    }

    try {
        await db.collection('users').insertOne(user);

        const userData = await db.collection('users').findOne({ name, email });

        db.collection('records').insertOne({ user: userData._id, records:[] });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.status(201).send({ message:'Usuário criado.' });
}

async function SignIn (req, res) {
    const { email, password } = req.body;
    const { user } = res.locals;

    if (!user) {
        return res.status(401).send({ message:'Email e/ou senha inválida.' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
        return res.status(401).send({ message:'Email e/ou senha inválida.' });
    }

    const token = uuid();

    try {
        await db.collection('sessions').insertOne({ userId: user._id, token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.status(200).send({ name:user.name, email, token });
}

async function LogOut (req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    let session;

    try {
        session = await db.collection('sessions').findOne({ token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if (!session) return res.sendStatus(404);

    try {
        await db.collection('sessions').deleteOne({ token });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    res.sendStatus(200);
}

export { SignUp, SignIn, LogOut };
