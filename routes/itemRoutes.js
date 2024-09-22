const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authController = require('../controllers/authController');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', authController.authenticate, authController.authorize(['merchant']), itemController.createItem);
router.put('/:id', authController.authenticate, authController.authorize(['merchant']), itemController.updateItem);
router.delete('/:id', authController.authenticate, authController.authorize(['merchant']), itemController.deleteItem);
router.put('/:id/verify', authController.authenticate, authController.authorize(['admin']), itemController.verifyItem);
router.put('/:id/unverify', authController.authenticate, authController.authorize(['admin']), itemController.unverifyItem);


module.exports = router;

