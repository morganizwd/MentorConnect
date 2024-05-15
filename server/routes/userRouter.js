const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/userController.js');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', userController.auth);
router.get('/:id', userController.findOne); // Get one user by ID
router.get('/', userController.findAll); // Get all users
router.delete('/:id', userController.delete); // Delete a user

module.exports = router;