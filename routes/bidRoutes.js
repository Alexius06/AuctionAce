const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authController = require('../controllers/authController');

// Protected routes
router.get('/', authController.authenticate, bidController.getAllBids);
router.get('/:id', authController.authenticate, bidController.getBidById);
router.post('/', authController.authenticate, authController.authorize(['bidder']), bidController.createBid);
router.put('/:id', authController.authenticate, authController.authorize(['bidder']), bidController.updateBid);
router.delete('/:id', authController.authenticate, authController.authorize(['bidder','admin']), bidController.deleteBid);

module.exports = router;
