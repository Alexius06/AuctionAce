const User = require('../models/User');
const bcrypt = require('bcrypt');


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
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
        const saveduser= await newUser.save();

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
