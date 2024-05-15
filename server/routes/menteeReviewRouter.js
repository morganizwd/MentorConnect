const Router = require('express').Router;
const menteeReviewController = require('../controllers/menteeReviewController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, menteeReviewController.create);
router.get('/', menteeReviewController.findAll);
router.get('/:id', menteeReviewController.findOne);
router.put('/:id', authenticateToken, menteeReviewController.update);
router.delete('/:id', authenticateToken, menteeReviewController.delete);

module.exports = router;
