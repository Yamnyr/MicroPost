const mongoose = require('mongoose');
// Par celle-ci :
const bcrypt = require('bcryptjs');


// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Ajout du champ password
});

// Avant de sauvegarder un utilisateur, hacher le mot de passe
userSchema.pre('save', async function(next) {
    // Vérifier si le mot de passe a été modifié ou s'il s'agit d'une création d'utilisateur
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Hachage du mot de passe avec un salt de 10 tours
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Méthode pour comparer un mot de passe en clair avec le mot de passe haché
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
