const router = require('express').Router();
const { protect } = require('../controller/verify');
const { userMe } = require('./../controller/user');
router.route('/info').get(protect, userMe);
module.exports = router;
