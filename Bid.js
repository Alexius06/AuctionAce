const mongoose = require('mongoose');
const schema = mongoose.schema;

const BidSchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
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
    bidAmount: {
        type: Number,
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