const Router = require('express').Router;
const mentorshipSessionController = require('../controllers/mentorshipSessionController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { mentorshipSessionSchema, mentorshipSessionUpdateSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentor', 'admin', 'mentee']), validate(mentorshipSessionSchema), mentorshipSessionController.create);
router.get('/', authenticateToken, mentorshipSessionController.findAll);
router.get('/:id', authenticateToken, mentorshipSessionController.findOne);
router.patch('/:id', authenticateToken, authorizeRole(['mentor', 'admin', 'mentee']), validate(mentorshipSessionUpdateSchema), mentorshipSessionController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentor', 'admin', 'mentee']), mentorshipSessionController.delete);

module.exports = router;