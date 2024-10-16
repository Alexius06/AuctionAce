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
    const { review_text, rating, userId } = req.body;
    console.log(req.body);
    try {
        const newReview = new Review({
            review_text,
            rating,
            userId,
        });
        await newReview.save();
        res.status(201).json({ message: 'Review created successfully', newReview });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create review', error });
    }
};

exports.getRandomReviews = async (req, res) => {
    try {
        const randomReviews = await Review.aggregate([{ $sample: { size: 2 } }]); // Retrieve 3 random events
        res.status(200).json(randomReviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch random reviews', error });
    }
};
