const Router = require('express').Router;
const router = new Router();
const specializationController = require('../controllers/specializationController');

router.post('/', specializationController.create);
router.get('/', specializationController.findAll);
router.get('/:id', specializationController.findOne);
router.put('/:id', specializationController.update);
router.delete('/:id', specializationController.delete);

module.exports = router;
