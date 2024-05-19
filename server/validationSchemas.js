const Joi = require('joi');

// Схемы для создания
const userSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // Только для регистрации, не сохраняйте пароль напрямую в базу данных
    role: Joi.string().valid('mentee', 'mentor', 'admin').required(),
    course: Joi.number().integer().min(1).max(10).allow(null),
    recordBookNumber: Joi.number().integer().allow(null),
    facultyId: Joi.number().integer().required(),
    specializationId: Joi.number().integer().required(),
});

const resourceSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow(null, ''),
});

const postSchema = Joi.object({
    content: Joi.string().required(),
    forumId: Joi.number().integer().required(),
});

const contactSchema = Joi.object({
    vk: Joi.string().uri().allow(null, ''),
    telegram: Joi.string().allow(null, ''),
    phoneNumber: Joi.string().pattern(/^[0-9\-\+]{9,15}$/).allow(null, ''),
    userId: Joi.number().integer().required(),
});

const mentorReviewSchema = Joi.object({
    comment: Joi.string().allow(null, ''),
    rating: Joi.number().min(1).max(5).required(),
    mentorshipSessionId: Joi.number().integer().required(),
});

const menteeReviewSchema = Joi.object({
    comment: Joi.string().allow(null, ''),
    rating: Joi.number().min(1).max(5).required(),
    mentorshipSessionId: Joi.number().integer().required(),
});

const mentorshipSessionSchema = Joi.object({
    scheduledTime: Joi.date().required(),
    isFinished: Joi.boolean().required(),
    mentorId: Joi.number().integer().required(),
    menteeId: Joi.number().integer().required(),
});

const forumSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().required(),
});

const tagSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
});

const facultySchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
});

const specializationSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
});

// Схемы для редактирования
const userUpdateSchema = Joi.object({
    firstName: Joi.string().min(1).max(50),
    lastName: Joi.string().min(1).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(8), // Только для регистрации, не сохраняйте пароль напрямую в базу данных
    role: Joi.string().valid('mentee', 'mentor', 'admin'),
    course: Joi.number().integer().min(1).max(10).allow(null),
    recordBookNumber: Joi.number().integer().allow(null),
    facultyId: Joi.number().integer(),
    specializationId: Joi.number().integer(),
});

const resourceUpdateSchema = Joi.object({
    title: Joi.string().min(1).max(255),
    description: Joi.string().allow(null, ''),
});

const postUpdateSchema = Joi.object({
    content: Joi.string(),
});

const contactUpdateSchema = Joi.object({
    vk: Joi.string().uri().allow(null, ''),
    telegram: Joi.string().allow(null, ''),
    phoneNumber: Joi.string().pattern(/^[0-9\-\+]{9,15}$/).allow(null, ''),
    userId: Joi.number().integer(),
});

const mentorReviewUpdateSchema = Joi.object({
    comment: Joi.string().allow(null, ''),
    rating: Joi.number().min(1).max(5),
    mentorshipSessionId: Joi.number().integer(),
});

const menteeReviewUpdateSchema = Joi.object({
    comment: Joi.string().allow(null, ''),
    rating: Joi.number().min(1).max(5),
    mentorshipSessionId: Joi.number().integer(),
});

const mentorshipSessionUpdateSchema = Joi.object({
    scheduledTime: Joi.date(),
    isFinished: Joi.boolean(),
    mentorId: Joi.number().integer(),
    menteeId: Joi.number().integer(),
});

const forumUpdateSchema = Joi.object({
    title: Joi.string().min(1).max(255),
    description: Joi.string(),
});

const tagUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(50),
});

const facultyUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(255),
});

const specializationUpdateSchema = Joi.object({
    name: Joi.string().min(1).max(255),
});

module.exports = {
    userSchema,
    resourceSchema,
    postSchema,
    contactSchema,
    mentorReviewSchema,
    menteeReviewSchema,
    mentorshipSessionSchema,
    forumSchema,
    tagSchema,
    facultySchema,
    specializationSchema,
    userUpdateSchema,
    resourceUpdateSchema,
    postUpdateSchema,
    contactUpdateSchema,
    mentorReviewUpdateSchema,
    menteeReviewUpdateSchema,
    mentorshipSessionUpdateSchema,
    forumUpdateSchema,
    tagUpdateSchema,
    facultyUpdateSchema,
    specializationUpdateSchema,
};