import mongo from '../database/db.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import joi from 'joi';

const db = await mongo();

const userSchema = joi.object({
    name: joi.string().required().max(30),
    email: joi.string().email().required(),
    password: joi.string().required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

async function SignUp (req, res) {
    const { name, email, password } = req.body;
    const { user: hasUser } = res.locals;

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
}

async function SignIn (req, res) {
    const { email, password } = req.body;
    const { user } = res.locals;

    const isValid = loginSchema.validate({ email, password }, { abortEarly: false });

    if (isValid.error) {
        const errors = isValid.error.details.map(({ message }) => message);
        return res.status(400).send({ message:errors });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
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

export { SignUp, SignIn };