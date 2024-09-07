const mongoose = require('mongoose');
const schema = mongoose.schema;

const HistorySchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    EventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
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

HistorySchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();History
});


const History = mongoose.model('History', HistorySchema,'Auction History');    
module.exports = History;  