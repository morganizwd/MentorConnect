const Router = require('express').Router;
const specializationController = require('../controllers/specializationController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { specializationSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['admin']), validate(specializationSchema), specializationController.create);
router.get('/', authenticateToken, specializationController.findAll);
router.get('/:id', authenticateToken, specializationController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['admin']), validate(specializationSchema), specializationController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), specializationController.delete);

module.exports = router;