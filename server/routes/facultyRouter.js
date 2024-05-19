const Router = require('express').Router;
const facultyController = require('../controllers/facultyController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { facultySchema, facultyUpdateSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['admin']), validate(facultySchema), facultyController.create);
router.get('/', facultyController.findAll);
router.get('/:id', facultyController.findOne);
router.patch('/:id', authenticateToken, authorizeRole(['admin']), validate(facultyUpdateSchema), facultyController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), facultyController.delete);

module.exports = router;