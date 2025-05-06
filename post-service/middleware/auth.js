const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
module.exports = (req, res, next) => {
    const token = req.headers['authorization']; // Récupérer le token dans les headers
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, 'secretkey');
        // console.error(decoded)
        req.user = decoded; // Ajouter l'ID de l'utilisateur dans la requête
        next(); // Passer au prochain middleware ou à la route
    } catch (err) {
        res.status(403).json({ message: 'Token invalide' });
    }
};
