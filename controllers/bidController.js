const Bid = require('../models/Bid');
const Item = require('../models/Item');
const Event = require('../models/Event');
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
    const id = req.params.id;
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

exports.getUserbids = async (req, res) => {
    const UserId = req.user ? req.user.id : req.body.userId;
    // console.log(UserId);

    try {
        const bids = await Bid.find({ userId: UserId }).populate('itemId', 'Itemname'); // Find items with matching user ID

        res.status(200).json({ success: true, data: bids });
    } catch (error) {
        console.error('retrievind user bids  failed:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve bids', error: error.message });
    }
};

exports.getHighestBidsForItem = async (req, res) => {
    try {
        // Fetch all bids
        const UserId = req.params.id || req.user.id;
        console.log("requser");
        const allBids = await Bid.find();

        // Group bids by itemId
        const groupedBids = allBids.reduce((groups, bid) => {
            if (!groups[bid.itemId]) groups[bid.itemId] = [];
            groups[bid.itemId].push(bid);
            return groups;
        }, {});
        console.log( Object.keys(groupedBids).length)

        const Wonitems = [];

        // Iterate through each group and find the highest bid
        for (const itemId in groupedBids) {
            const bidsForItem = groupedBids[itemId];

            // Find the highest bid inNaira
            let highestBid = bidsForItem.reduce((max, bid) =>
                parseFloat(bid.bidInNaira) > parseFloat(max.bidInNaira) ? bid : max
            );
            console.log(highestBid.itemId);
            
            // Populate with item details
            const item = await Item.findById(highestBid.itemId)
            if (!item){
                console.log("Item is missing");
                continue;
            };
            console.log(item)

            const event = await Event.findById(highestBid.eventId);
            if (!event || event.status !== 'Ended') {
                // Skip this bid if the event status is not 'Ended'
                console.log(`Skipping bid for event ${highestBid.eventId}, status: ${event ? event.status : "Unknown"}`);
                continue;
            }
            highestBid = {
                ...highestBid, // Spread the existing fields of highestBid
                itemName: item.Itemname,
                itemImg: item.Itemimgs[0] // Adding the new fields
            };

            console.log(highestBid._doc.userId);
            console.log(UserId)
            // Compare userId with req.user.id
            if (highestBid._doc.userId.toString() === UserId) {
                Wonitems.push(highestBid);
            }
        }

        // Send the highest bids for this user
        res.json({ data: Wonitems });
    } catch (error) {
        console.log('Failed to get highest bids for item:', error);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Create a new bid
exports.createBid = async (req, res) => {
    const { userId, itemId, EventId, bidAmount, bidinNaira } = req.body;

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
    const id = req.params.id;
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
