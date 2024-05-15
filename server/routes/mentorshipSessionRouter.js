const Router = require('express').Router;
const router = new Router();
const mentorshipSessionController = require('../controllers/mentorshipSessionController');

router.post('/', mentorshipSessionController.create);
router.get('/', mentorshipSessionController.findAll);
router.get('/:id', mentorshipSessionController.findOne);
router.put('/:id', mentorshipSessionController.update);
router.delete('/:id', mentorshipSessionController.delete);

module.exports = router;