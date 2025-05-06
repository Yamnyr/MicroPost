const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion (déjà existante)
router.post('/login', authController.login);

router.get('/:id', authController.getUserById);
module.exports = router;
