const Router = require('express').Router;
const mentorshipSessionController = require('../controllers/mentorshipSessionController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, authorizeRole(['mentor', 'admin', 'mentee']), mentorshipSessionController.create);
router.get('/', authenticateToken, mentorshipSessionController.findAll);
router.get('/:id', authenticateToken, mentorshipSessionController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentor', 'admin', 'mentee']), mentorshipSessionController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentor', 'admin', 'mentee']), mentorshipSessionController.delete);

module.exports = router;
