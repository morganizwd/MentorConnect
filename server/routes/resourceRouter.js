const Router = require('express').Router;
const router = new Router();
const resourceController = require('../controllers/resourceController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.single('file'), resourceController.create);
router.get('/', resourceController.findAll);
router.get('/:id', resourceController.findOne);
router.put('/:id', authenticateToken, resourceController.update);
router.delete('/:id', authenticateToken, resourceController.delete);

// New route for downloading files
router.get('/:id/download', resourceController.download);

module.exports = router;