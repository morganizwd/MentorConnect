const Router = require('express').Router;
const contactsController = require('../controllers/contactsController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { contactSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), validate(contactSchema), contactsController.create);
router.get('/', authenticateToken, contactsController.findAll);
router.get('/:id', authenticateToken, contactsController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), validate(contactSchema), contactsController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), contactsController.delete);

module.exports = router;