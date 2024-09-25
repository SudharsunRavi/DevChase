const router= require('express').Router();
const { sendConnectionRequest } = require('../controllers/connection.controller');
const verifiedUser = require('../middlewares/auth.middleware');

router.post('/send/:toUser/:status', verifiedUser, sendConnectionRequest);

module.exports = router;