const Joi = require('@hapi/joi');

const ideaValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(6).required(),
        details: Joi.string().required()
    });

    return schema.validate(data);
}

const userValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        password2: Joi.valid(Joi.ref('password')).required().label('Confirm Password')
    });
    return schema.validate(data);
}

module.exports.ideaValidation = ideaValidation;
module.exports.userValidation = userValidation;