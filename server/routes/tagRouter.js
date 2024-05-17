const Router = require('express').Router;
const tagController = require('../controllers/tagController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const authorizeOwnerOrAdmin = require('../middleware/authorizeOwnerOrAdmin');
const validate = require('../middleware/validate');
const { tagSchema, tagUpdateSchema } = require('../validationSchemas');
const { Tag } = require('../models/models'); 

const router = Router();

router.post('/', authenticateToken, authorizeRole(['admin', 'mentee', 'mentor']), validate(tagSchema), tagController.create);
router.get('/', authenticateToken, tagController.findAll);
router.get('/:id', authenticateToken, tagController.findOne);
router.patch('/:id', authenticateToken, authorizeOwnerOrAdmin(Tag), validate(tagUpdateSchema), tagController.update);
router.delete('/:id', authenticateToken, authorizeOwnerOrAdmin(Tag), tagController.delete); 

module.exports = router;
