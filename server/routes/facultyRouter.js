const Router = require('express').Router;
const router = Router(); // Используйте Router() для создания нового маршрутизатора
const facultyController = require('../controllers/facultyController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

router.post('/', authenticateToken, authorizeRole(['admin']), facultyController.create);
router.get('/', authenticateToken, facultyController.findAll);
router.get('/:id', authenticateToken, facultyController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['admin']), facultyController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), facultyController.delete);

module.exports = router;