const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authController = require('../controllers/authController');

// Protected routes
router.get('/', authController.authenticate, bidController.getAllBids);
router.get('/:id', authController.authenticate, bidController.getBidById);
router.get('/user/:id', authController.authenticate, bidController.getUserbids);  
router.delete('/:id', authController.authenticate, authController.authorize(['bidder','admin']), bidController.deleteBid);  
router.get('/wonitems/:id', authController.authenticate, bidController.getHighestBidsForItem);        
router.post('/', authController.authenticate, authController.authorize(['bidder']), bidController.createBid);


module.exports = router;
