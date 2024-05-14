const Router = require('express').Router;
const router = new Router();
const facultyController = require('../controllers/facultyController');

router.post('/', facultyController.create);
router.get('/', facultyController.findAll);
router.get('/:id', facultyController.findOne);
router.put('/:id', facultyController.update);
router.delete('/:id', facultyController.delete);

module.exports = router;
