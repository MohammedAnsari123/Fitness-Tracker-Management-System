const express = require('express');
const router = express.Router();
const { getAllPayments, getUserPayments, createPayment, createPaymentIntent } = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllPayments);
router.post('/', protect, adminOnly, createPayment);
router.get('/my', protect, getUserPayments);

// Stripe endpoint
router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
