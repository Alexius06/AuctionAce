const mongoose = require('mongoose');
const schema = mongoose.Schema;

const BidSchema = new schema({
    // id: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    EventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    bidAmount: {
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
BidSchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();
});


const Bid = mongoose.model('Bid', BidSchema,'Bids');    
module.exports = Bid;