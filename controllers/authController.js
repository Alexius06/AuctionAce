const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const { console } = require('inspector');



// Register a new user
exports.register = async (req, res) => {
    const { username, email, password, firstname, lastname, phoneNumber, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'Email already in use' });

        let newUser = new User({
            username,
            email,
            password,
            firstname,
            lastname,
            phoneNumber,
            role
        });

        newUser = await newUser.save();
        const token = jwt.sign({ id: newUser._id, role: newUser.role },process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('Btoken', token, {
            httpOnly: false, 
            secure: true,
            sameSite: 'Strict'
            
        });
        console.log('Response Headers:', res.getHeaders());
        res.status(201).json({ message: 'User created successfully', newUser,token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error });
    }
};
  
// Login user and provide JWT
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id, role: user.role },process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('Btoken', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'Strict'
            
        });
        console.log('Response Headers:', res.getHeaders());
        res.status(200).json({ ok: true,token, user});   
    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error });
    }
};
exports.logout = async (req, res) => {
    try {
        await res.clearCookie('Btoken', {
            httpOnly: true,  // Ensure the cookie is cleared in a secure way
            secure: false,   // Set to true in production if using HTTPS
            sameSite: 'Strict'
        });
        console.log('hiiiiiiii  im  checking');
        // Send the login page file after logout
        return res.sendFile(path.join(__dirname, '../public/index.html'));
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to logout', error });
        console.log(error)
        
    }
};


exports.getProfilePage = (req, res) => {
    
    try {
        if (req.user.role === 'bidder') {        
            return res.sendFile(path.join(__dirname, '../public/bidderprofile.html'));
        } else if (req.user.role === 'merchant') {
            return res.sendFile(path.join(__dirname, '../public/merchantProfile.html'));
        } else if (req.user.role === 'admin') {
            return res.sendFile(path.join(__dirname, '../public/Admin.html'));  
        } else {
            res.status(403).send('Access denied: Invalid role');
        }
        res.status(200).json({ message: 'Profile Page successfully checked' });    
    } catch (error) {
        res.status(500).json({ message: 'Failed to get profile page', error });
        console.log(error) ;
    }
};

// Middleware to check if user is authenticated
exports.authenticate = (req, res, next) => {
    var token = req.cookies.Btoken;
    console.log(token);
    // if (typeof token === 'string' && token.startsWith('Bearer ')) {
    //     token = token.slice(7);  // Remove the 'Bearer ' prefix by slicing from the 7th character
    // } 
    

    if (!token){
        console.log('no  token provided ');
        
        // return res.status(401).json({ message:'no token found', redirect: '/login' })
    } 

    jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
        if (err) {
            console.log('Invalid token');   
            // return res.status(401).json({ message:'incorrect token', redirect: '/login' })
        }
        console.log(decoded)
        req.user = decoded;
        next();
    });
};

// Middleware to check if user has a specific role
exports.authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
};

