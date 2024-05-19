const Router = require('express').Router;
const { resourceController, upload } = require('../controllers/resourceController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const validate = require('../middleware/validate');
const { resourceSchema, resourceUpdateSchema } = require('../validationSchemas');

const router = Router();

const validateFile = (req, res, next) => {
    if (!req.file && req.method === 'POST') {
        return res.status(400).json({ message: '"file" is required' });
    }
    next();
};

router.post(
    '/',
    authenticateToken,
    authorizeRole(['mentee', 'mentor', 'admin']),
    upload.single('file'),
    validateFile,
    validate(resourceSchema),
    resourceController.create
);

router.get('/', resourceController.findAll);
router.get('/:id', resourceController.findOne);

router.patch(
    '/:id',
    authenticateToken,
    authorizeRole(['mentee', 'mentor', 'admin']),
    upload.single('file'),
    validate(resourceUpdateSchema),
    resourceController.update
);

router.delete('/:id', authenticateToken, authorizeRole(['mentee', 'mentor', 'admin']), resourceController.delete);

router.get('/:id/download', resourceController.download);

module.exports = router;