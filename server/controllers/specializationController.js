const { Specialization } = require('../models/models'); // Предполагается, что все модели экспортируются из одного файла

const specializationController = {
    // Создание новой специализации
    create: async (req, res) => {
        try {
            const { name } = req.body;
            const specialization = await Specialization.create({ name });
            res.status(201).json(specialization);
        } catch (error) {
            res.status(500).json({ message: 'Error creating the specialization', error: error.message });
        }
    },

    // Получение списка всех специализаций
    findAll: async (req, res) => {
        try {
            const specializations = await Specialization.findAll();
            res.status(200).json(specializations);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving specializations', error: error.message });
        }
    },

    // Получение одной специализации по ID
    findOne: async (req, res) => {
        try {
            const specialization = await Specialization.findByPk(req.params.id);
            if (specialization) {
                res.status(200).json(specialization);
            } else {
                res.status(404).json({ message: 'Specialization not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding the specialization', error: error.message });
        }
    },

    // Обновление специализации по ID
    update: async (req, res) => {
        try {
            const { name } = req.body;
            const result = await Specialization.update({ name }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Specialization updated successfully' });
            } else {
                res.status(404).json({ message: 'Specialization not found or no update needed' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating the specialization', error: error.message });
        }
    },

    // Удаление специализации по ID
    delete: async (req, res) => {
        try {
            const result = await Specialization.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Specialization deleted successfully' });
            } else {
                res.status(404).json({ message: 'Specialization not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting the specialization', error: error.message });
        }
    }
};

module.exports = specializationController;