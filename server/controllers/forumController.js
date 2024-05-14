const { Forum } = require('../models/models'); // Make sure this path is correct based on your project structure

const forumController = {
    // Create a new forum
    create: async (req, res) => {
        try {
            const { title, description } = req.body;
            const forum = await Forum.create({ title, description });
            res.status(201).json(forum);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the forum', error: error.message });
        }
    },

    // Retrieve all forums
    findAll: async (req, res) => {
        try {
            const forums = await Forum.findAll();
            res.status(200).json(forums);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving forums', error: error.message });
        }
    },

    // Retrieve a single forum by id
    findOne: async (req, res) => {
        try {
            const forum = await Forum.findByPk(req.params.id);
            if (forum) {
                res.status(200).json(forum);
            } else {
                res.status(404).json({ message: 'Forum not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the forum', error: error.message });
        }
    },

    // Update a forum by id
    update: async (req, res) => {
        try {
            const { title, description } = req.body;
            const result = await Forum.update({ title, description }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Forum updated successfully' });
            } else {
                res.status(404).json({ message: 'Forum not found or no update necessary' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the forum', error: error.message });
        }
    },

    // Delete a forum by id
    delete: async (req, res) => {
        try {
            const result = await Forum.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Forum deleted successfully' });
            } else {
                res.status(404).json({ message: 'Forum not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the forum', error: error.message });
        }
    }
};

module.exports = forumController;