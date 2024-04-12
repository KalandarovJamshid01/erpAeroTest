const router = require('express').Router();
const {} = require('./../controller/auth');
router.route('/signup').post();
router.route('/signin').post();
router.route('/info').get();
router.route('/logout').get();
module.exports = router;
