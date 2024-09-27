const router= require('express').Router();
const { pendingRequests, myConnections, myfeed } = require('../controllers/user.controller');
const verifiedUser = require('../middlewares/auth.middleware');

router.get('/requests/pending', verifiedUser, pendingRequests);
router.get('/connections', verifiedUser, myConnections);
router.get('/feed', verifiedUser, myfeed);

module.exports = router;