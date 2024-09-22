const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ReviewSchema = new schema({
    // id: {
    //     type: Number,
    //     required: true,
    //     unique: true,
          
    // },
    review_text: {
        type: String,
        minlength: 10,
        maxlength: 500
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,        
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }   
});
ReviewSchema.pre('save',function(next){
    this.updatedAt = Date.now();    
    next();
});


const Review = mongoose.model('Review', ReviewSchema,'Reviews');    
module.exports = Review;  