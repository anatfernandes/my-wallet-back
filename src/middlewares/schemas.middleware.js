import loginSchema from "../schemas/login.schema.js";
import recordSchema from "../schemas/record.schema.js";
import userSchema from "../schemas/user.schema.js";

function recordSchemaMiddleware (req, res, next) {
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

    next();
}

function userSchemaMiddleware (req, res, next) {
    const { name, email, password } = req.body;

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
    userSchemaMiddleware,
    loginSchemaMiddleware
}