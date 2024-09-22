
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstname:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50   
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },  
    phoneNumber:{
        type: Number,
        required: true,
        
    },
    role: {
        type: String,
        enum: ['bidder','merchant','admin'],
        default: 'bidder'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }   
})
userSchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();
});
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('User', userSchema,'Users');    
module.exports = User;