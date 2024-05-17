const Router = require('express').Router;
const mentorReviewController = require('../controllers/mentorReviewController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { mentorReviewSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentee', 'admin']), validate(mentorReviewSchema), mentorReviewController.create);
router.get('/', authenticateToken, mentorReviewController.findAll);
router.get('/:id', authenticateToken, mentorReviewController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'admin']), validate(mentorReviewSchema), mentorReviewController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'admin']), mentorReviewController.delete);

module.exports = router;