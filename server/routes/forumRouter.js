const Router = require('express').Router;
const forumController = require('../controllers/forumController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { forumSchema, forumUpdateSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), validate(forumSchema), forumController.create);
router.get('/', authenticateToken, forumController.findAll);
router.get('/:id', authenticateToken, forumController.findOne);
router.patch('/:id', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), validate(forumUpdateSchema), forumController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), forumController.delete);

module.exports = router;
