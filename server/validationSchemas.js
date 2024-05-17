const Joi = require('joi');

const userSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // Только для регистрации, не сохраняйте пароль напрямую в базу данных
    role: Joi.string().valid('MENTEE', 'MENTOR', 'ADMIN').required(),
    course: Joi.number().integer().min(1).max(10).allow(null),
    recordBookNumber: Joi.number().integer().allow(null),
    facultyId: Joi.number().integer().required(),
    specializationId: Joi.number().integer().required(),
});

const resourceSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow(null, ''),
    file: Joi.any().required(), // Можете добавить другие правила для файлов
    userId: Joi.number().integer().required(),
});

const postSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    content: Joi.string().required(),
    userId: Joi.number().integer().required(),
});

const contactSchema = Joi.object({
    vk: Joi.string().uri().allow(null, ''),
    telegram: Joi.string().uri().allow(null, ''),
    phoneNumber: Joi.string().pattern(/^[0-9\-\+]{9,15}$/).allow(null, ''),
    userId: Joi.number().integer().required(),
});

const mentorReviewSchema = Joi.object({
    fromUserId: Joi.number().integer().required(),
    comment: Joi.string().allow(null, ''),
    rating: Joi.number().min(1).max(5).required(),
    mentorshipSessionId: Joi.number().integer().required(),
});

const menteeReviewSchema = Joi.object({
    fromUserId: Joi.number().integer().required(),
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
    userId: Joi.number().integer().required(),
});

const facultySchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
});

const specializationSchema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
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
};