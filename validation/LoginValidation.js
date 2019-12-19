const Joi = require('@hapi/joi');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": `Email should be a type of 'text'`,
      "string.empty": "Email cannot be an empty field",
      "string.email": "Email is invalid",
      "email": "Email is invalid",
      "any.required": `Email is a required field`
    }),

  password: Joi.string()
    .min(4)
    .required()
    .messages({
      "string.base": `Email should be a type of 'text'`,
      "string.empty": "Email cannot be an empty field",
      "any.required": `Email is a required field`
    }),
})

const LoginValidation = data => {
  return schema.validate({...data});
}

export default LoginValidation