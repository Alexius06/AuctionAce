const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.get('/', authController.authenticate, reviewController.getAllReviews);
router.get('/:id', authController.authenticate, reviewController.getReviewById);
router.post('/', authController.authenticate, reviewController.createReview);
router.put('/:id', authController.authenticate, reviewController.updateReview);
router.delete('/:id', authController.authenticate, reviewController.deleteReview);


module.exports = router;
