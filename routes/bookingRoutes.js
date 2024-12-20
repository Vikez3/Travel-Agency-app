const express = require('express');
const {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  getCheckoutSession
} = require('./../controllers/bookingController');
const { restrictTo, protect } = require('./../controllers/authController');

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
