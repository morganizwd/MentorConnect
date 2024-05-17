const Router = require('express').Router;
const contactsController = require('../controllers/contactsController.js');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const authorizeOwnerOrAdmin = require('../middleware/authorizeOwnerOrAdmin');
const validate = require('../middleware/validate');
const { contactSchema, contactUpdateSchema } = require('../validationSchemas');
const { Contacts } = require('../models/models');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), validate(contactSchema), contactsController.create);
router.get('/', authenticateToken, contactsController.findAll);
router.get('/:id', authenticateToken, contactsController.findOne);
router.patch('/:id', authenticateToken, authorizeOwnerOrAdmin(Contacts), validate(contactUpdateSchema), contactsController.update); 
router.delete('/:id', authenticateToken, authorizeOwnerOrAdmin(Contacts), contactsController.delete);

module.exports = router;
