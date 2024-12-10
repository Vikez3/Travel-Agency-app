const express = require('express');
const {
  getTour,
  getOverview,
  getAccount,
  getLoginForm,
  getMyTours,
  updateUserData,
  alerts,
  getSignUpForm,
  leaveReview
} = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');
// const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.use(alerts);

router.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignUpForm);
router.get('/me', protect, getAccount);

router.get('/tour/:slug/review', protect, leaveReview);

// router.get('/my-tours', createBookingCheckout, protect, getMyTours);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
