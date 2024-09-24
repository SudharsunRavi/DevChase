const router= require('express').Router();
const { view, update, updatePassword } = require('../controllers/profile.contoller');
const verifiedUser = require('../middlewares/auth.middleware');

router.get('/view', verifiedUser, view);
router.patch('/update', verifiedUser, update);
router.patch('/updatePassword', verifiedUser, updatePassword);

module.exports = router;