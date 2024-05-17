const Router = require('express').Router;
const resourceController = require('../controllers/resourceController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const validate = require('../middleware/validate');
const { resourceSchema } = require('../validationSchemas');

const router = Router();

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), upload.single('file'), validate(resourceSchema), resourceController.create);
router.get('/', resourceController.findAll);
router.get('/:id', resourceController.findOne);
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), validate(resourceSchema), resourceController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), resourceController.delete);

router.get('/:id/download', resourceController.download);

module.exports = router;