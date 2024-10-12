const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.get('/', authController.authenticate, authController.authorize(['admin']), userController.getAllUsers);
router.get('/admins', authController.authenticate, authController.authorize(['admin']), userController.getAdmins);
router.post('/sendwarning/:id', authController.authenticate, authController.authorize(['admin']), userController.sendwarning);
router.get('/logout', authController.logout);
router.get('/profile', authController.authenticate, authController.getProfilePage);
router.post('/', userController.createUser);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/:id', authController.authenticate, userController.getUserById);
router.put('/:id', authController.authenticate, userController.updateUser);
router.delete('/:id', authController.authenticate, authController.authorize(['admin']), userController.deleteUser);

module.exports = router;


// {
//     "username": "janedoe",
//     "firstname": "Jane",
//     "lastname": "Doe",
//     "email": "janedoe@gmail.com",
//     "password": "1234567890"
//     "phoneNumber": "0987654321",
//     "role": "merchant"
// }


// {
//     "username": "peterdoe",
//     "firstname": "Peter",
//     "lastname": "Doe",
//     "email": "peterdoe@gmail.com",
//     "password": "1234567890"
//     "phoneNumber": "0987654321",
//     "role": "merchant"
// }

// {
//     "username": "johndoe",
//     "firstname": "John",
//     "lastname": "Doe",
//     "email": "johndoe@gmail.com",
//     "password": "password123"
//     "phoneNumber": "1234567890",
//     "role": "admin"
// }