const router= require('express').Router();
const { getChats } = require('../controllers/chat.controller');
const verifiedUser = require('../middlewares/auth.middleware');

router.get('/:toId', verifiedUser, getChats)

module.exports = router;