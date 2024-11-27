// src/validation/loginValidation.js
import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'Email обязателен',
        'string.email': 'Введите корректный email',
        'any.required': 'Email обязателен',
    }),
    password: Joi.string().min(8).required().messages({
        'string.empty': 'Пароль обязателен',
        'string.min': 'Пароль должен содержать минимум 8 символов',
        'any.required': 'Пароль обязателен',
    }),
});
