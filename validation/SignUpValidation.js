const Joi = require('@hapi/joi');

const schema = Joi.object({
  email: Joi.string()
  .email()
  .required()
  .messages({
    "string.base": `Email should be a type of 'text'`,
    "string.empty": "Email cannot be an empty field",
    "string.email": "Email is invalid",
    "any.required": `Email is a required field`
  }),

  firstName: Joi.string()
  .required()
  .messages({
    "string.base": `First Name should be a type of 'text'`,
    "string.empty": "First Name cannot be an empty field",
    "any.required": `First Name is a required field`
  }),

  lastName: Joi.string()
  .required()
  .messages({
    "string.base": `Last Name should be a type of 'text'`,
    "string.empty": "Last Name cannot be an empty field",
    "any.required": `Last Name is a required field`
  }),

  password: Joi.string()
    .min(4)
    .required()
    .messages({
      "string.base": `Password should be a type of 'text'`,
      "string.empty": "Password cannot be an empty field",
      "any.required": `Password is a required field`
    }),

  repassword: Joi.ref('password'),
})
.with('password', 'repassword')

const SignUpValidation = data => {
  return schema.validate({...data});
}

export default SignUpValidation