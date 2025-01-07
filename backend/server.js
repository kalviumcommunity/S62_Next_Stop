if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3010;
const connectDataBase = require('./DB/database.js');

app.get('/ping', (req, res) => {
    return res.send('pong');
});

app.get('/', (req, res) => {
    const status = mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected';
    res.send({ status });
});

app.listen(PORT, () => {
    connectDataBase();
    console.log(`Server is running at http://localhost:${PORT}`);
});
