const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const EventSchema = new schema({
    Eventname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    Description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    Eventimg:  {
        type: String, 
        required: true  
    },
    StartTime: {
        type: Date,
        required: true,
    },
    EndTime: {
        type: Date,
        required: true,
    },
    status: {   
        type: String,
        enum: ['Upcoming','Ongoing','Ended'],
        default: 'Upcoming' 
    },  
    ItemIDs:{    
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Item',
        required: true,
    },
    createdby: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
EventSchema.methods.getDuration = function() {
    const diff = this.end_time - this.start_time;
    const durationInMinutes = Math.floor(diff / (1000 * 60));
    return durationInMinutes;
};
EventSchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();
});


const Event = mongoose.model('Event', EventSchema,'Auction Events');    
module.exports = Event;  

