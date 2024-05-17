const Router = require('express').Router;
const tagController = require('../controllers/tagController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { tagSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['admin', 'mentee', 'mentor']), validate(tagSchema), tagController.create);
router.get('/', authenticateToken, tagController.findAll);
router.get('/:id', authenticateToken, tagController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'mentee', 'mentor']), validate(tagSchema), tagController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'mentee', 'mentor']), tagController.delete);

module.exports = router;