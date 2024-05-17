const Router = require('express').Router;
const userController = require('../controllers/userController.js');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { userSchema } = require('../validationSchemas');

const router = Router();

router.post('/registration', validate(userSchema), userController.registration);
router.post('/login', userController.login);
router.get('/auth', authenticateToken, userController.auth);
router.get('/:id', authenticateToken, userController.findOne);
router.get('/',  userController.findAll);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.delete);

module.exports = router;
