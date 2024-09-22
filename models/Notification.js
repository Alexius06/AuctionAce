const mongoose = require('mongoose');
const schema = mongoose.Schema;

const NotificationSchema = new schema({
    // id: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    notification: {
        type: String,
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
    type: {
        type: String,
        enum:['Reminder','Auction Started','Auction Ended'],
        default: 'Reminder'
    },
    status: {   
        type: String,
        enum:['Sent','Unsent'],
        default: 'Sent'
    },  
    sentAt: {
        type: Date,
        default: Date.now
    },
       
});  



const Notification = mongoose.model('Notification', NotificationSchema,'Notifications');    
module.exports = Notification;  