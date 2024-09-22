const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



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
            sameSite: 'None', 
            maxAge: 3600000 // 1 hour
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
            sameSite: 'None', 
            maxAge: 3600000 // 1 hour
        });
        console.log('Response Headers:', res.getHeaders());
        res.status(200).json({ ok: true,token, user});   
    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error });
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
        return res.status(401).json({ message:'no token found', redirect: '/login' })
    } 

    jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
        if (err) {
            console.log('Invalid token');   
            return res.status(401).json({ message:'incorrect token', redirect: '/login' })
        }

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

