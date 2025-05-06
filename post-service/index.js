const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
// require('dotenv').config();

const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost/MicroPost', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.log(err));

// Utilisation des routes
app.use('/', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Post Service running on port ${PORT}`);
});
