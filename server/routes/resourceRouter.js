const Router = require('express').Router;
const router = new Router();
const resourceController = require('../controllers/resourceController');

router.post('/', resourceController.create);
router.get('/', resourceController.findAll);
router.get('/:id', resourceController.findOne);
router.put('/:id', resourceController.update);
router.delete('/:id', resourceController.delete);

module.exports = router;
