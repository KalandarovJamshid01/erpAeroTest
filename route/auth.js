const router = require('express').Router();
const {
  signUp,
  signIn,
  signInRefresh,
  logout,
} = require('./../controller/auth');
router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/signin/new_token').post(signInRefresh);
router.route('/logout').get(logout);
module.exports = router;
