const { Contacts } = require('../models/models'); 

const contactsController = {

    create: async (req, res) => {
        try {
            const { vk, telegram, phoneNumber, userId } = req.body;
            const contact = await Contacts.create({ vk, telegram, phoneNumber, userId });
            res.status(201).json(contact);
        } catch (error) {
            res.status(500).json({ message: 'Error creating contact', error: error.message });
        }
    },


    findAll: async (req, res) => {
        try {
            const contacts = await Contacts.findAll();
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving contacts', error: error.message });
        }
    },


    findOne: async (req, res) => {
        try {
            const contact = await Contacts.findByPk(req.params.id);
            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: 'Contact not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding contact', error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            const { vk, telegram, phoneNumber, userId } = req.body;
            const result = await Contacts.update({ vk, telegram, phoneNumber, userId }, { where: { id: req.params.id } });
            if (result[0] === 1) {
                res.status(200).json({ message: 'Contact updated successfully' });
            } else {
                res.status(404).json({ message: 'Contact not found or no update necessary' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating contact', error: error.message });
        }
    },


    delete: async (req, res) => {
        try {
            const result = await Contacts.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Contact deleted successfully' });
            } else {
                res.status(404).json({ message: 'Contact not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting contact', error: error.message });
        }
    }
};

module.exports = contactsController;