const Router = require('express').Router;
const mentorReviewController = require('../controllers/mentorReviewController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, authorizeRole(['mentee', 'admin']), mentorReviewController.create);
router.get('/', authenticateToken, mentorReviewController.findAll);
router.get('/:id', authenticateToken, mentorReviewController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'admin']), mentorReviewController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'admin']), mentorReviewController.delete);

module.exports = router;