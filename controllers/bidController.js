const Bid = require('../models/Bid');
const Item = require('../models/Item');
// Get all bids
exports.getAllBids = async (req, res) => {
    try {
        const bids = await Bid.find().populate('userId').populate('itemId').populate('EventId');
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve bids', error });
    }
};

// Get bid by ID
exports.getBidById = async (req, res) => {
    const id= req.params.id;
    try {
        const bid = await Bid.findById(id).populate('userId').populate('itemId').populate('EventId');
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        res.status(200).json(bid);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve bid', error });
    }
};

// Create a new bid
exports.createBid = async (req, res) => {
    const { userId, itemId, EventId, bidAmount,bidinNaira } = req.body;

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Prevent users from bidding on their own items
        if (item.Userid.toString() === userId.toString()) {
            return res.status(403).json({ message: 'You cannot bid on your own item' });
        }
        const newBid = new Bid({
            userId,
            itemId,
            EventId,
            bidAmount,
            bidinNaira
        });

        await newBid.save();
        
        res.status(201).json({ message: 'Bid created successfully', newBid });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create bid', error });
    }
};

// Update a bid


// Delete a bid
exports.deleteBid = async (req, res) => {
    const id= req.params.id;
    try {
        const deletedBid = await Bid.findByIdAndDelete(id);
        if (!deletedBid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        res.status(200).json({ message: 'Bid deleted successfully', deletedBid });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete bid', error });
    }
};
