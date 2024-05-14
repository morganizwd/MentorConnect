const Router = require('express').Router;
const router = new Router();
const forumController = require('../controllers/forumController');

router.post('/', forumController.create);
router.get('/', forumController.findAll);
router.get('/:id', forumController.findOne);
router.put('/:id', forumController.update);
router.delete('/:id', forumController.delete);

module.exports = router;
