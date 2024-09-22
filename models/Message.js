const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MessageSchema = new schema({
    // id: {
    //     type: Number,
    //     required: true,
    //     unique: true,
        
    // },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    },
    EventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    message: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    status: {   
        type: String,
        enum: ['Sent','Unsent'],
        default: 'Sent'
    },  
    updatedAt: {
        type: Date,
        default: Date.now
    }   
});
MessageSchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();
});


const Message = mongoose.model('Message', MessageSchema,'Messages');    
module.exports = Message;  