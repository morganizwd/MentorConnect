const Router = require('express').Router;
const menteeReviewController = require('../controllers/menteeReviewController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, authorizeRole(['mentor', 'admin']), menteeReviewController.create);
router.get('/', authenticateToken, menteeReviewController.findAll);
router.get('/:id', authenticateToken, menteeReviewController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentor', 'admin']), menteeReviewController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentor', 'admin']), menteeReviewController.delete);

module.exports = router;