const axios = require('axios');
const USER_SERVICE_URL = 'http://localhost:3000/api/users';

exports.getUserById = async (userId) => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/${userId}`);
        return response.data;
    } catch (err) {
        console.error(`❌ Erreur utilisateur (${userId}) :`, err.message);
        return null;
    }
};
