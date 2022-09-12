import { stripHtml } from 'string-strip-html';

import loginSchema from "../schemas/login.schema.js";
import recordSchema from "../schemas/record.schema.js";
import userSchema from "../schemas/user.schema.js";

function recordSchemaMiddleware (req, res, next) {
    let { details, price, type } = req.body;

    details = stripHtml(details).result.trim();
    price = stripHtml(price).result.trim();
    type = stripHtml(type).result.trim();

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

    next();
}

function signUpSchemaMiddleware (req, res, next) {
    const { email, password } = req.body;
    let { name } = req.body;

    name = stripHtml(name).result.trim();

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

    next();
}

function loginSchemaMiddleware (req, res, next) {
    const { email, password } = req.body;

    const isValid = loginSchema.validate({ email, password }, { abortEarly: false });

    if (isValid.error) {
        const errors = isValid.error.details.map(({ message }) => message);
        return res.status(400).send({ message:errors });
    }

    next();
}

export {
    recordSchemaMiddleware,
    signUpSchemaMiddleware,
    loginSchemaMiddleware
}