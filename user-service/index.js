const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost/MicroPost', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.log(err));

// Utilisation des routes
app.use('/', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
