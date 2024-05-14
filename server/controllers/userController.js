const { User } = require('../models/models');  // Убедитесь, что путь к моделям верный
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    // Регистрация пользователя
    registration: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role, course, recordBookNumber, facultyId, specializationId } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);  // Хеширование пароля перед сохранением
            const user = await User.create({ firstName, lastName, email, passwordHash, role, course, recordBookNumber, facultyId, specializationId });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Вход пользователя
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
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Авторизация (проверка)
    auth: async (req, res) => {
        try {
            // Допустим, токен приходит в заголовках запроса
            const token = req.headers.authorization.split(' ')[1];  // "Bearer TOKEN"
            if (!token) {
                return res.status(401).json({ message: "Not authorized" });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;
