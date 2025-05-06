// services/cache.js
const redis = require('redis');

const client = redis.createClient();

client.on('error', err => console.error('❌ Redis Error:', err));

(async () => {
    try {
        await client.connect();
        console.log('✅ Redis connecté');
    } catch (err) {
        console.error('❌ Échec connexion Redis:', err);
    }
})();

module.exports = client;
