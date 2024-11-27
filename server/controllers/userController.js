const { User } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const userController = {
    registration: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role, course, recordBookNumber, facultyId, specializationId } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);
            const user = await User.create({ firstName, lastName, email, passwordHash, role, course, recordBookNumber, facultyId, specializationId });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }
            if (!process.env.JWT_SECRET) {
                console.error("JWT Secret is not defined.");
                return res.status(500).json({ message: "Server configuration error" });
            }
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    auth: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Not authorized" });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    findOne: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    findAll: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role, course, recordBookNumber, facultyId, specializationId } = req.body;
            const userId = req.params.id;

            // Загрузка аватара
            let avatarPath;
            if (req.file) {
                const uploadDir = path.join(__dirname, '../uploads/avatars');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                avatarPath = `/uploads/avatars/${userId}_${req.file.originalname}`;
                fs.writeFileSync(path.join(uploadDir, `${userId}_${req.file.originalname}`), req.file.buffer);
            }

            const updateData = {
                firstName, lastName, email, role, course, recordBookNumber, facultyId, specializationId
            };

            if (avatarPath) {
                updateData.avatar = avatarPath;
            }

            if (password) {
                updateData.passwordHash = await bcrypt.hash(password, 12);
            }

            const [updated] = await User.update(updateData, {
                where: { id: userId }
            });

            if (updated) {
                const updatedUser = await User.findByPk(userId);
                res.json(updatedUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const result = await User.destroy({
                where: { id: req.params.id }
            });
            if (result === 1) {
                res.status(200).json({ message: 'User successfully deleted' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteAvatar: async (req, res) => {
        try {
            const userId = req.params.id;

            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Проверяем, имеет ли пользователь аватар
            if (!user.avatar) {
                return res.status(400).json({ message: 'Аватар отсутствует' });
            }

            // Путь к файлу аватара
            const avatarPath = path.join(__dirname, '..', user.avatar);

            // Удаляем файл аватара, если он существует
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }

            // Обновляем запись пользователя, удаляя ссылку на аватар
            user.avatar = null;
            await user.save();

            res.json({ message: 'Аватар успешно удален' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = userController;
