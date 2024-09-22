const Message = require('../models/Message');

// Create a new message
exports.createMessage = async (req, res) => {
    const { senderId, EventId, message, status } = req.body;

    try {
        const newMessage = new Message({
            senderId,
            EventId,
            message,
            status
        });
        await newMessage.save();
        res.status(201).json({ message: 'Message created successfully', newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create message', error });
    }
};

// Get all messages
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve messages', error });
    }
};

// Get a specific message by ID
exports.getMessageById = async (req, res) => {
    const id  = req.params.id;
    try {
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve message', error });
    }
};

// Update a message by ID
exports.updateMessage = async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    try {
        const message = await Message.findByIdAndUpdate(id, updateData, { new: true });
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message updated successfully', message });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update message', error });
    }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
    const id = req.params.id;
    try {
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully',message });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete message', error });
    }
};
