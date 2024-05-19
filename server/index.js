require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./db.js');
const models = require('./models/models.js');
const cors = require('cors');

const router = require('./routes/index.js');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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