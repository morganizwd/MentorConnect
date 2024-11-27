// src/validation/registerValidation.js
import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Имя обязательно',
    'string.min': 'Имя должно содержать минимум 1 символ',
    'string.max': 'Имя не должно превышать 50 символов',
    'any.required': 'Имя обязательно',
  }),
  lastName: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Фамилия обязательна',
    'string.min': 'Фамилия должна содержать минимум 1 символ',
    'string.max': 'Фамилия не должна превышать 50 символов',
    'any.required': 'Фамилия обязательна',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Электронная почта обязательна',
    'string.email': 'Введите корректный email',
    'any.required': 'Электронная почта обязательна',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Пароль обязателен',
    'string.min': 'Пароль должен содержать минимум 8 символов',
    'any.required': 'Пароль обязателен',
  }),
  role: Joi.string().valid('mentee', 'mentor', 'admin').required().messages({
    'any.only': 'Выберите корректную роль',
    'any.required': 'Роль обязательна',
  }),
  course: Joi.number().integer().min(1).max(10).allow(null).messages({
    'number.base': 'Курс должен быть числом',
    'number.min': 'Курс должен быть минимум 1',
    'number.max': 'Курс должен быть максимум 10',
  }),
  recordBookNumber: Joi.number().integer().allow(null).messages({
    'number.base': 'Номер зачетной книжки должен быть числом',
  }),
  facultyId: Joi.number().integer().required().messages({
    'number.base': 'Факультет должен быть числом',
    'any.required': 'Факультет обязателен',
  }),
  specializationId: Joi.number().integer().required().messages({
    'number.base': 'Специализация должна быть числом',
    'any.required': 'Специализация обязательна',
  }),
});
