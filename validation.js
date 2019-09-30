const Joi = require('@hapi/joi');

const ideaValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(6).required(),
        details: Joi.string().required()
    });

    return schema.validate(data);
}

module.exports.ideaValidation = ideaValidation;