const Payment = require('../models/Payment');

// Create a new payment
exports.createPayment = async (req, res) => {
    const { Amount, Status, ItemId, UserId, BidId, EventId, PaymentDate, PaymentMethod } = req.body;

    try {
        const newPayment = new Payment({
            Amount,
            Status,
            ItemId,
            UserId,
            BidId,
            EventId,
            PaymentDate,
            PaymentMethod
        });
        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', newPayment });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create payment', error });
    }
};

// Get all payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve payments', error });
    }
};

// Get a specific payment by ID
exports.getPaymentById = async (req, res) => {
    const id = req.params.id;
    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve payment', error });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    try {
        const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update payment', error });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    const id = req.params.id;
    try {
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully', payment }); 
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete payment', error });
    }
};
