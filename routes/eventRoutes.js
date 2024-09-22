const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authController.authenticate, authController.authorize(['admin']), eventController.createEvent);
router.put('/:id', authController.authenticate, authController.authorize(['admin']), eventController.updateEvent);
router.delete('/:id', authController.authenticate, authController.authorize(['admin']), eventController.deleteEvent);

module.exports = router;

