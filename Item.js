const mongoose = require('mongoose');   
const schema = mongoose.schema;

const ItemSchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true,
          
    },
    Itemname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    Description: {
        type: String,
        required: true,
        unique: true,
        
    },
    AskingPrice: {
        type: String,
        required: true,
        minlength: 0
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
const Item = mongoose.model('Item', ItemSchema,'Items');    
module.exports = Item;   