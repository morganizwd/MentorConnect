const Router = require('express').Router;
const router = new Router();
const contactsController = require('../controllers/contactsController');

router.post('/', contactsController.create);
router.get('/', contactsController.findAll);
router.get('/:id', contactsController.findOne);
router.put('/:id', contactsController.update);
router.delete('/:id', contactsController.delete);

module.exports = router;