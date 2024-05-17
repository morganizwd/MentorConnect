const Router = require('express').Router;
const userController = require('../controllers/userController.js');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', userController.auth);
router.get('/:id', userController.findOne); // Get one user by ID
router.get('/', authenticateToken, authorizeRole(['admin']), userController.findAll); // Get all users (Only admin)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.delete); // Delete a user (Only admin)

module.exports = router;