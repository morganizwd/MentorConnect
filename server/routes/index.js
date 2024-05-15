const Router = require('express').Router;
const router = new Router();

router.use('/users', require('./userRouter'));
router.use('/tags', require('./tagRouter'));
router.use('/specializations', require('./specializationRouter'));
router.use('/mentor-reviews', require('./mentorReviewRouter'));
router.use('/mentee-reviews', require('./menteeReviewRouter'));
router.use('/resources', require('./resourceRouter'));
router.use('/posts', require('./postRouter'));
router.use('/mentorshipSessions', require('./mentorshipSessionRouter'));
router.use('/forums', require('./forumRouter'));
router.use('/faculties', require('./facultyRouter'));
router.use('/contacts', require('./contactsRouter'));

module.exports = router;
