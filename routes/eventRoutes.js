const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

router.get('/', eventController.getAllEvents);
router.get('/random', eventController.getRandomEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authController.authenticate, authController.authorize(['admin']), eventController.createEvent);
router.put('/:id', authController.authenticate, authController.authorize(['admin']), eventController.updateEvent);
router.put('/start/:id', authController.authenticate, authController.authorize(['admin']), eventController.StartEvent);
router.put('/close/:id', authController.authenticate, authController.authorize(['admin']), eventController.CloseEvent);
router.delete('/:id', authController.authenticate, authController.authorize(['admin']), eventController.deleteEvent);

module.exports = router;

  