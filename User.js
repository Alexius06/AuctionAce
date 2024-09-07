
const mongoose = require('mongoose');
const schema = mongoose.schema;

const userSchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true,
          
    },
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


const User = mongoose.model('User', userSchema,'Users');    
module.exports = User;  