const multer = require('multer');
const fs = require('fs');
const path = require('path');
const contentDisposition = require('content-disposition');

const { Resource } = require('../models/models');

// Настройка multer для сохранения файлов в директорию 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const resourceController = {

    create: async (req, res) => {
        try {
            const { title, description } = req.body;
            const file = req.file;
            const userId = req.userId;

            if (!file) {
                return res.status(400).json({ message: '"file" is required' });
            }

            const resource = await Resource.create({
                title,
                description,
                filePath: file.path,
                fileType: file.mimetype,
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
            const { title, description, userId } = req.body;
            const file = req.file;

            const updatedFields = { title, description, userId };
            if (file) {
                updatedFields.filePath = file.path;
                updatedFields.fileType = file.mimetype;
            }

            const result = await Resource.update(updatedFields, { where: { id: req.params.id } });
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
            const resource = await Resource.findByPk(req.params.id);
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            // Проверка, является ли текущий пользователь владельцем ресурса или администратором
            if (resource.userId !== req.userId && req.userRole !== 'admin') {
                return res.status(403).json({ message: 'Доступ запрещен: вы не можете удалить этот ресурс' });
            }

            // Удаление файла с сервера
            fs.unlinkSync(resource.filePath);

            // Удаление записи из базы данных
            await Resource.destroy({ where: { id: req.params.id } });
            res.status(200).json({ message: 'Resource deleted successfully' });
        } catch (error) {
            console.error('Error deleting resource:', error);
            res.status(500).json({ message: 'Error deleting the resource', error: error.message });
        }
    },

    download: async (req, res) => {
        try {
            const resource = await Resource.findByPk(req.params.id);
            if (resource) {
                const originalExtension = path.extname(resource.filePath); // e.g., ".docx"
                const originalName = path.basename(resource.filePath); // e.g., "uniqueid-document.docx"

                // Если хотите использовать оригинальное имя файла
                const finalFilename = originalName;

                // Или, если хотите использовать заголовок с расширением
                // const safeFilename = resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                // const finalFilename = `${safeFilename}${originalExtension}`;

                res.setHeader('Content-Type', resource.fileType);
                res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`);
                res.sendFile(path.resolve(resource.filePath));
            } else {
                res.status(404).json({ message: 'Resource not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error downloading the file', error: error.message });
        }
    },

};

module.exports = {
    upload,
    resourceController
};