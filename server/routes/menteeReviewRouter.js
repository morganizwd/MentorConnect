const Router = require('express').Router;
const menteeReviewController = require('../controllers/menteeReviewController');
const authenticateToken = require('../middleware/authenticateToken');

const menteeReviewRouter = new Router();
menteeReviewRouter.post('/', authenticateToken, menteeReviewController.create);
menteeReviewRouter.get('/', menteeReviewController.findAll);
menteeReviewRouter.get('/:id', menteeReviewController.findOne);
menteeReviewRouter.put('/:id', authenticateToken, menteeReviewController.update);
menteeReviewRouter.delete('/:id', authenticateToken, menteeReviewController.delete);

module.exports = { mentorReviewRouter, menteeReviewRouter };
