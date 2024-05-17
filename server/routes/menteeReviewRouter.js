const Router = require('express').Router;
const menteeReviewController = require('../controllers/menteeReviewController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { menteeReviewSchema, menteeReviewUpdateSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentor', 'admin']), validate(menteeReviewSchema), menteeReviewController.create);
router.get('/', authenticateToken, menteeReviewController.findAll);
router.get('/:id', authenticateToken, menteeReviewController.findOne);
router.patch('/:id', authenticateToken, authorizeRole(['mentor', 'admin']), validate(menteeReviewUpdateSchema), menteeReviewController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentor', 'admin']), menteeReviewController.delete);

module.exports = router;
