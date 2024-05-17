const Router = require('express').Router;
const resourceController = require('../controllers/resourceController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = Router(); // Используйте Router() для создания нового маршрутизатора

router.post('/', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), upload.single('file'), resourceController.create);
router.get('/', resourceController.findAll); // Доступен всем, включая неаутентифицированных пользователей
router.get('/:id', resourceController.findOne); // Доступен всем, включая неаутентифицированных пользователей
router.put('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), resourceController.update);
router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), resourceController.delete);

// New route for downloading files
router.get('/:id/download', resourceController.download); // Доступен всем, включая неаутентифицированных пользователей

module.exports = router;
