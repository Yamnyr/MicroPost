const jwt = require('jsonwebtoken');

// Route pour l'inscription
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
        name,
        email,
        password,  // Le mot de passe sera haché avant d'être enregistré
    });

    try {
        await newUser.save();

        // Générer le token JWT
        const token = jwt.sign({ userId: newUser._id }, 'secretkey', { expiresIn: '1h' });

        // Retourner le token au client
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error });
    }
};

// Route pour la connexion
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
        return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

    // Retourner le token au client
    res.json({ token });
};

const User = require('../models/userModel');

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (err) {
        console.error('Erreur récupération utilisateur:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
