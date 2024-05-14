require('dotenv').config();

const express = require('express');
const sequelize = require('./db.js');
const models = require('./models/models.js');
const cors = require('cors');

// Импорт роутов
const router = require('./routes/index.js');  // Предполагается, что ваш файл с роутами называется routes.js

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Подключение роутов к приложению
app.use('/', router);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (e) {
        console.log(e); 
    }
}

start();
