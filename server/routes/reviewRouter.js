const Router = require('express').Router;
const router = new Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.create);
router.get('/', reviewController.findAll);
router.get('/:id', reviewController.findOne);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.delete);

module.exports = router;
