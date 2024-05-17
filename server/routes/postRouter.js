const Router = require('express').Router;
const postController = require('../controllers/postController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), postController.create);
router.get('/', postController.findAll); // Доступен всем, включая неаутентифицированных пользователей
router.get('/:id', postController.findOne); // Доступен всем, включая неаутентифицированных пользователей
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), postController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), postController.delete);

module.exports = router;