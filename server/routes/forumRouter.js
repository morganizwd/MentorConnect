const Router = require('express').Router;
const router = Router(); // Используйте Router() для создания нового маршрутизатора
const forumController = require('../controllers/forumController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

router.post('/', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), forumController.create);
router.get('/', authenticateToken, forumController.findAll);
router.get('/:id', authenticateToken, forumController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), forumController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'mentor', 'mentee']), forumController.delete);

module.exports = router;