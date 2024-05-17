const { MentorReview } = require('../models/models'); 

const mentorReviewController = {

    create: async (req, res) => {
        try {
            const { comment, rating, mentorshipSessionId } = req.body;
            const fromUserId = req.userId;

            const review = await MentorReview.create({
                fromUserId,
                comment,
                rating,
                mentorshipSessionId
            });
            res.status(201).json(review);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the review', error: error.message });
        }
    },


    findAll: async (req, res) => {
        try {
            const reviews = await MentorReview.findAll();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
        }
    },


    findOne: async (req, res) => {
        try {
            const review = await MentorReview.findByPk(req.params.id);
            if (review) {
                res.status(200).json(review);
            } else {
                res.status(404).json({ message: 'Review not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the review', error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            const { comment, rating } = req.body;
            const result = await MentorReview.update({ comment, rating }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Review updated successfully' });
            } else {
                res.status(404).json({ message: 'Review not found or no update needed' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the review', error: error.message });
        }
    },


    delete: async (req, res) => {
        try {
            const result = await MentorReview.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Review deleted successfully' });
            } else {
                res.status(404).json({ message: 'Review not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the review', error: error.message });
        }
    }
};

module.exports = mentorReviewController;