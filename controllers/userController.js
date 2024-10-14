const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'auction.ace.0@gmail.com',
        pass: 'uabi qviq ykwc ocaj'
    }
});
// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAdmins = async (req, res) => {
    try {
        const users = await User.find({ role: 'admin' });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: err.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { username, email, password, firstname, lastname, phoneNumber, role } = req.body;

    try {


        const newUser = new User({
            username,
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            role
        });
        const saveduser = await newUser.save();

        res.status(201).json({ message: 'User created successfully', saveduser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error });
    }


};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.sendwarning = async (req, res) => {
    const userId = req.params.id;
    console.log(userId);    
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the email using Nodemailer
        const mailOptions = {
            from: 'auction.ace.0@gmail.com',   
            to: user.email,                 
            subject: 'Warning Notification', 
            text: `Hello ${user.username},\n\nThis is a warning regarding your account activity.\nPlease contact support if you have any questions.\n\nBest regards,\nAuctionAce Team`  // Email content
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send email', error: error.message });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: `Warning email sent to user: ${user.username}` });
        });
    } catch (error) {
        console.error('Error sending warning:', error);
        res.status(500).json({ message: 'Failed to send warning', error: error.message });
    }
}
