const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

router.get('/', authController.authenticate, notificationController.getNotifications);
router.get('/:id', authController.authenticate, notificationController.getNotificationById);
router.post('/', authController.authenticate, authController.authorize(['admin']), notificationController.createNotification);
router.put('/:id', authController.authenticate, authController.authorize(['admin']), notificationController.updateNotification);
router.delete('/:id', authController.authenticate, authController.authorize(['admin']), notificationController.deleteNotification);


module.exports = router;
