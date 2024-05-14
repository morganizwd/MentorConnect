const { Resource } = require('../models/models'); // Ensure the correct path to your models

const resourceController = {
    // Create a new Resource
    create: async (req, res) => {
        try {
            const { title, description, file, userId } = req.body;
            const resource = await Resource.create({ title, description, file, userId });
            res.status(201).json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the resource', error: error.message });
        }
    },

    // Retrieve all Resources
    findAll: async (req, res) => {
        try {
            const resources = await Resource.findAll();
            res.status(200).json(resources);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving resources', error: error.message });
        }
    },

    // Retrieve a single Resource by id
    findOne: async (req, res) => {
        try {
            const resource = await Resource.findByPk(req.params.id);
            if (resource) {
                res.status(200).json(resource);
            } else {
                res.status(404).json({ message: 'Resource not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the resource', error: error.message });
        }
    },

    // Update a Resource by id
    update: async (req, res) => {
        try {
            const { title, description, file, userId } = req.body;
            const result = await Resource.update({ title, description, file, userId }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Resource updated successfully' });
            } else {
                res.status(404).json({ message: 'Resource not found or no update necessary' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the resource', error: error.message });
        }
    },

    // Delete a Resource by id
    delete: async (req, res) => {
        try {
            const result = await Resource.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Resource deleted successfully' });
            } else {
                res.status(404).json({ message: 'Resource not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the resource', error: error.message });
        }
    }
};

module.exports = resourceController;