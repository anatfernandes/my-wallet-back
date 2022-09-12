import joi from 'joi';

const recordSchema = joi.object({
    id: joi.number(),
    date: joi.string(),
    details: joi.string().required(),
    price: joi.string().required(),
    type: joi.string().required()
});

export default recordSchema;