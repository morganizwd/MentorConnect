const { MentorshipSession } = require('../models/models');

const mentorshipSessionController = {

    create: async (req, res) => {
        try {
            const { scheduledTime, isFinished, mentorId, menteeId } = req.body;
            const mentorshipSession = await MentorshipSession.create({ scheduledTime, isFinished, mentorId, menteeId });
            res.status(201).json(mentorshipSession);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the mentorship session', error: error.message });
        }
    },


    findAll: async (req, res) => {
        try {
            const sessions = await MentorshipSession.findAll();
            res.status(200).json(sessions);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving mentorship sessions', error: error.message });
        }
    },


    findOne: async (req, res) => {
        try {
            const session = await MentorshipSession.findByPk(req.params.id);
            if (session) {
                res.status(200).json(session);
            } else {
                res.status(404).json({ message: 'Mentorship session not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the mentorship session', error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            const { scheduledTime, isFinished, mentorId, menteeId } = req.body;
            const result = await MentorshipSession.update({
                scheduledTime,
                isFinished,
                mentorId,
                menteeId
            }, {
                where: { id: req.params.id }
            });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Mentorship session updated successfully' });
            } else {
                res.status(404).json({ message: 'Mentorship session not found or no update necessary' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the mentorship session', error: error.message });
        }
    },


    delete: async (req, res) => {
        try {
            const result = await MentorshipSession.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Mentorship session deleted successfully' });
            } else {
                res.status(404).json({ message: 'Mentorship session not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the mentorship session', error: error.message });
        }
    }
};

module.exports = mentorshipSessionController;