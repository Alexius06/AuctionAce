const Item = require('../models/Item');

// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific item by ID
exports.getItemById = async (req, res) => {
    const id = req.params.id;
    
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new item
exports.createItem = async (req, res) => {
    const { Itemname, Description,Itemimgs, AskingPrice, Userid } = req.body;

    const newItem = new Item({
        Itemname,
        Description,
        Itemimgs,
        AskingPrice,
        Userid
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    try {
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.verifyItem = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, { verified: true }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item verified successfully', updatedItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.unverifyItem = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, { verified: false }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item unverified successfully', updatedItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


