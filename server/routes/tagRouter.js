const Router = require('express').Router;
const router = new Router();
const tagController = require('../controllers/tagController');

router.post('/', tagController.create);
router.get('/', tagController.findAll);
router.get('/:id', tagController.findOne);
router.put('/:id', tagController.update);
router.delete('/:id', tagController.delete);

module.exports = router;
