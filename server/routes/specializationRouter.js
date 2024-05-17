const Router = require('express').Router;
const specializationController = require('../controllers/specializationController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, authorizeRole(['admin']), specializationController.create);
router.get('/', authenticateToken, specializationController.findAll);
router.get('/:id', authenticateToken, specializationController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['admin']), specializationController.update);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), specializationController.delete);

module.exports = router;
