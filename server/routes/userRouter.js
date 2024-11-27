const Router = require('express').Router;
const userController = require('../controllers/userController.js');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const validate = require('../middleware/validate');
const { userSchema, userUpdateSchema } = require('../validationSchemas');

const router = Router();

router.post('/registration', validate(userSchema), userController.registration);
router.post('/login', userController.login);
router.get('/auth', authenticateToken, userController.auth);
router.get('/:id', authenticateToken, userController.findOne);
router.get('/', userController.findAll);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.delete);

// Новый маршрут для удаления аватара
router.delete('/:id/avatar', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), userController.deleteAvatar);

router.patch('/:id', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), upload.single('avatar'), validate(userUpdateSchema), userController.update);

module.exports = router;