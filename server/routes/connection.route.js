const router= require('express').Router();
const { sendConnectionRequest, receiveConnectionRequest } = require('../controllers/connection.controller');
const verifiedUser = require('../middlewares/auth.middleware');

router.post('/send/:toUser/:status', verifiedUser, sendConnectionRequest);
router.post('/receive/:status/:connectionRequestId', verifiedUser, receiveConnectionRequest);

module.exports = router;