const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { Resource } = require('../models/models');

const resourceController = {

    create: async (req, res) => {
        try {
            const { title, description } = req.body;
            const file = req.file;
            const userId = req.userId;

            const resource = await Resource.create({
                title,
                description,
                file: file.buffer,
                userId
            });

            res.status(201).json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the resource', error: error.message });
        }
    },


    findAll: async (req, res) => {
        try {
            const resources = await Resource.findAll();
            res.status(200).json(resources);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving resources', error: error.message });
        }
    },


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
    },

    download: async (req, res) => {
        try {
            const resource = await Resource.findByPk(req.params.id);
            if (resource) {
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${resource.title}"`);
                res.send(resource.file);
            } else {
                res.status(404).json({ message: 'Resource not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error downloading the file', error: error.message });
        }
    }
};

module.exports = resourceController;