const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

router.get('/', authController.authenticate, messageController.getMessages);
router.get('/:id', authController.authenticate, messageController.getMessageById);
router.post('/', authController.authenticate, messageController.createMessage);
router.put('/:id', authController.authenticate, messageController.updateMessage);
router.delete('/:id', authController.authenticate, messageController.deleteMessage);


module.exports = router;
