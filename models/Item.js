const mongoose = require('mongoose');   
const schema = mongoose.Schema;

const ItemSchema = new schema({
    Itemname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    Description: {
        type: String,
        required: true,
        
        
    },
    Itemimgs:  {
        type: Array,
        required: true,
        minlength: 1,
        maxlength: 3   
    },
    AskingPrice: {
        type: String,
        required: true,
        minlength: 0
    },
    Userid:{
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
    },
    verified: { 
        type: Boolean, 
        default: false 
    } 
})
const Item = mongoose.model('Item', ItemSchema,'Items');    
module.exports = Item;   