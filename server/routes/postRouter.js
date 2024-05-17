const Router = require('express').Router;
const postController = require('../controllers/postController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { postSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), validate(postSchema), postController.create);
router.get('/', postController.findAll);
router.get('/:id', postController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), validate(postSchema), postController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), postController.delete);

module.exports = router;