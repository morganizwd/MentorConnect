const Router = require('express').Router;
const mentorReviewController = require('../controllers/mentorReviewController');
const authenticateToken = require('../middleware/authenticateToken');

const mentorReviewRouter = new Router();

mentorReviewRouter.post('/', authenticateToken, mentorReviewController.create);
mentorReviewRouter.get('/', mentorReviewController.findAll);
mentorReviewRouter.get('/:id', mentorReviewController.findOne);
mentorReviewRouter.put('/:id', authenticateToken, mentorReviewController.update);
mentorReviewRouter.delete('/:id', authenticateToken, mentorReviewController.delete);