const express = require('express');
const router = express.Router();
const { 
  getPayments, 
  getPaymentById, 
  createPayment, 
  updatePayment 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPaymentById)
  .put(updatePayment);

module.exports = router;
