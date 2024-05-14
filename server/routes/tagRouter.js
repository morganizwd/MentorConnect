const Router = require('express').Router;
const router = new Router();

router.use('/users', require('./userRoutes'));
router.use('/tags', require('./tagRoutes'));
router.use('/specializations', require('./specializationRoutes'));
router.use('/reviews', require('./reviewRoutes'));
router.use('/resources', require('./resourceRoutes'));
router.use('/posts', require('./postRoutes'));
router.use('/mentorshipSessions', require('./mentorshipSessionRoutes'));
router.use('/forums', require('./forumRoutes'));
router.use('/faculties', require('./facultyRoutes'));
router.use('/contacts', require('./contactRoutes'));

module.exports = router;