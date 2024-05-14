const { Faculty } = require('../models/models'); // Ensure the correct path to your models

const facultyController = {
    // Create a new faculty
    create: async (req, res) => {
        try {
            const { name } = req.body;
            const faculty = await Faculty.create({ name });
            res.status(201).json(faculty);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the faculty', error: error.message });
        }
    },

    // Retrieve all faculties
    findAll: async (req, res) => {
        try {
            const faculties = await Faculty.findAll();
            res.status(200).json(faculties);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving faculties', error: error.message });
        }
    },

    // Retrieve a single faculty by id
    findOne: async (req, res) => {
        try {
            const faculty = await Faculty.findByPk(req.params.id);
            if (faculty) {
                res.status(200).json(faculty);
            } else {
                res.status(404).json({ message: 'Faculty not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the faculty', error: error.message });
        }
    },

    // Update a faculty by id
    update: async (req, res) => {
        try {
            const { name } = req.body;
            const result = await Faculty.update({ name }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Faculty updated successfully' });
            } else {
                res.status(404).json({ message: 'Faculty not found or no update necessary' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the faculty', error: error.message });
        }
    },

    // Delete a faculty by id
    delete: async (req, res) => {
        try {
            const result = await Faculty.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Faculty deleted successfully' });
            } else {
                res.status(404).json({ message: 'Faculty not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the faculty', error: error.message });
        }
    }
};

module.exports = facultyController;