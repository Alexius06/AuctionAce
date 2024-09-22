const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);  


router.post('/login', authController.login);

module.exports = router;



// {
//     "username": "janedoe",
//     "firstname": "Jane",
//     "lastname": "Doe",
    // "email": "janedoe@gmail.com",
    // "password": "1234567890"
//     "phoneNumber": "0987654321",
//     "role": "bidder"
// }


// {
    // "username": "peterdoe",
    // "firstname": "Peter",
    // "lastname": "Doe",
    // "email": "peter2021doe@gmail.com",
    // "password": "1234567890"
    // "phoneNumber": "0987654321",
    // "role": "merchant"
// }

// {
//     "username": "johndoe",
//     "firstname": "John",
//     "lastname": "Doe",
    // "email": "johndoe@gmail.com",
    // "password": "password123"
//     "phoneNumber": "1234567890",
//     "role": "admin"
// }