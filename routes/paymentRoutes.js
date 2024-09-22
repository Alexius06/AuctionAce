const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

router.get('/', authController.authenticate, paymentController.getPayments);
router.get('/:id', authController.authenticate, paymentController.getPaymentById);
router.post('/', authController.authenticate, paymentController.createPayment);
router.put('/:id', authController.authenticate, paymentController.updatePayment);
router.delete('/:id', authController.authenticate, paymentController.deletePayment);


module.exports = router;
