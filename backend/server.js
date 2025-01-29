if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDatabase = require('./DB/database.js');
const routes = require('./routes/router.js');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3010;

app.use('/api', routes);

app.get('/ping', (req, res) => res.send('pong'));

app.get('/', (req, res) => {
    const status = mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected';
    res.send({ status });
});

app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server is running at http://localhost:${PORT}`);
});
