const { Tag } = require('../models/models');

const tagController = {
    create: async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.userId;
            const tag = await Tag.create({ name, userId });
            res.status(201).json(tag);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the tag', error: error.message });
        }
    },

    findAll: async (req, res) => {
        try {
            const { userId } = req.query;
            const tags = userId ? await Tag.findAll({ where: { userId } }) : await Tag.findAll();
            res.status(200).json(tags);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving tags', error: error.message });
        }
    },

    findOne: async (req, res) => {
        try {
            const tag = await Tag.findByPk(req.params.id);
            if (tag) {
                res.status(200).json(tag);
            } else {
                res.status(404).json({ message: 'Tag not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the tag', error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.userId;
            const result = await Tag.update({ name, userId }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Tag updated successfully' });
            } else {
                res.status(404).json({ message: 'Tag not found or no update needed' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the tag', error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const result = await Tag.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Tag deleted successfully' });
            } else {
                res.status(404).json({ message: 'Tag not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the tag', error: error.message });
        }
    }
};

module.exports = tagController;
