const Review = require('../models/Review');

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('itemId userId');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('itemId userId');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch the review', error });
    }
};

// Create a new review
exports.createReview = async (req, res) => {
    const { review_text, rating, itemId, userId } = req.body;

    try {
        const newReview = new Review({
            review_text,
            rating,
            itemId,
            userId,
        });
        await newReview.save();
        res.status(201).json({ message: 'Review created successfully', newReview });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create review', error });
    }
};

// Update an existing review
exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review updated successfully', updatedReview });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update review', error });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' , deletedReview});
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete review', error });
    }
};
