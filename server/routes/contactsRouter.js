const Router = require('express').Router;
const router = Router(); // Используйте Router() для создания нового маршрутизатора
const contactsController = require('../controllers/contactsController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), contactsController.create);
router.get('/', authenticateToken, contactsController.findAll);
router.get('/:id', authenticateToken, contactsController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), contactsController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), contactsController.delete);

module.exports = router;