const Router = require('express').Router;
const router = new Router();
const postController = require('../controllers/postController');

router.post('/', postController.create);
router.get('/', postController.findAll);
router.get('/:id', postController.findOne);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

module.exports = router;
