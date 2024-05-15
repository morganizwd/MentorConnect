const Router = require('express').Router;
const mentorReviewController = require('../controllers/mentorReviewController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, mentorReviewController.create);
router.get('/', mentorReviewController.findAll);
router.get('/:id', mentorReviewController.findOne);
router.put('/:id', authenticateToken, mentorReviewController.update);
router.delete('/:id', authenticateToken, mentorReviewController.delete);

module.exports = router;
