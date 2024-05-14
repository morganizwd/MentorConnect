const { Tag } = require('../models/models'); // Предположим, что все модели экспортируются из одного файла

const tagController = {
    // Создание нового тега
    create: async (req, res) => {
        try {
            const { name, userId } = req.body;
            const tag = await Tag.create({ name, userId });
            res.status(201).json(tag);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the tag', error: error.message });
        }
    },

    // Получение списка всех тегов
    findAll: async (req, res) => {
        try {
            const tags = await Tag.findAll();
            res.status(200).json(tags);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving tags', error: error.message });
        }
    },

    // Получение одного тега по ID
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

    // Обновление тега по ID
    update: async (req, res) => {
        try {
            const { name, userId } = req.body;
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

    // Удаление тега по ID
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