const Bid = require('../models/Bid');

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
    const { userId, itemId, EventId, bidAmount } = req.body;

    try {
        const newBid = new Bid({
            userId,
            itemId,
            EventId,
            bidAmount
        });

        await newBid.save();
        res.status(201).json({ message: 'Bid created successfully', newBid });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create bid', error });
    }
};

// Update a bid
exports.updateBid = async (req, res) => {
    const id  = req.params.id;
    const { bidAmount , EventId} = req.body;

    try {
        const updatedBid = await Bid.findByIdAndUpdate(
            id,
            { bidAmount , EventId },
            { new: true } // To return the updated document
        );
        if (!updatedBid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        res.status(200).json({ message: 'Bid updated successfully', updatedBid });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update bid', error });
    }
};

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
