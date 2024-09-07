const mongoose = require('mongoose');
const Bid = require('./Bid');
const schema = mongoose.schema;

const PaymentSchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    Amount: {
        type: Number,
        required: true,
    },
    Status: {
        type: String,
        required: true,
        enum: ['paid','pending','cancelled'],
        default: 'pending'  
    },
    ItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    BidId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: true,
    },
    EventId:{   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    PaymentDate: {  
        type: Date,
        required: true,
    },  
    
    PaymentMethod: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }   
});   
PaymentSchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();
});


const Payment = mongoose.model('Payment', PaymentSchema,'Payments');    
module.exports = Payment;  