# Documentation MicroPost

## Architecture Microservices

MicroPost est une application basée sur une architecture de microservices composée de trois services principaux :

1. **API Gateway** (port 3000) - Point d'entrée unique pour toutes les requêtes client
2. **User Service** (port 4000) - Gestion des utilisateurs et authentification
3. **Post Service** (port 5000) - Gestion des publications

## Endpoints disponibles

### API Gateway

L'API Gateway sert de point d'entrée et redirige les requêtes vers les services appropriés.

| Endpoint | Redirigé vers | Description |
|----------|---------------|-------------|
| `/api/users/*` | User Service (`http://localhost:4000/users/*`) | Toutes les opérations liées aux utilisateurs |
| `/api/posts/*` | Post Service (`http://localhost:5000/posts/*`) | Toutes les opérations liées aux publications |

### User Service

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/users/register` | POST | Inscription d'un nouvel utilisateur |
| `/users/login` | POST | Connexion utilisateur et génération du token JWT |

### Post Service

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/posts` | GET | Récupération de toutes les publications |
| `/posts/:id` | GET | Récupération d'une publication spécifique |
| `/posts` | POST | Création d'une nouvelle publication (nécessite authentification) |
| `/posts/:id` | PUT | Mise à jour d'une publication (nécessite authentification et être propriétaire) |
| `/posts/:id` | DELETE | Suppression d'une publication (nécessite authentification et être propriétaire) |

## Comment lancer les services

### Prérequis

- Node.js (v20 ou supérieur)
- MongoDB (doit être installé et en cours d'exécution sur le port par défaut 27017)
- Redis (doit être installé et en cours d'exécution)
- npm ou yarn

### Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier du user-service avec les configurations suivantes :

```
JWT_SECRET=test
```

### Installation des dépendances

Dans chaque dossier de service (API Gateway, User Service, Post Service), exécutez :

```bash
npm install
```

### Démarrage des services

1. **Démarrer MongoDB** (si ce n'est pas déjà fait)
   ```bash
   mongod
   ```

2. **Démarrer le User Service**
   ```bash
   cd user-service
   node index.js
   ```

3. **Démarrer le Post Service**
   ```bash
   cd post-service
   node index.js
   ```

4. **Démarrer l'API Gateway**
   ```bash
   cd api-gateway
   node app.js
   ```

Les services doivent être lancés dans des terminaux séparés et maintenus en exécution simultanément.

5. **Démarrer le Frontend**
   ```bash
   cd front
   npm install
   npm run dev
   ```

## Redis (implémenté)

Redis est utilisé dans l'architecture actuelle pour améliorer les performances via la mise en cache des données fréquemment accédées.

### Configuration de Redis

Redis est configuré dans le service de publications via le fichier `services/cache.js` :

```javascript
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
```

### Utilisation de Redis pour la mise en cache

Le service de publications utilise Redis pour mettre en cache les résultats des requêtes de récupération des publications. Cela améliore considérablement les performances en évitant des requêtes redondantes à la base de données MongoDB.

#### Principales fonctionnalités implémentées :

1. **Mise en cache des publications** - Les publications sont mises en cache avec une durée d'expiration de 300 secondes (5 minutes)
2. **Invalidation automatique du cache** - Le cache est invalidé (supprimé) lors de toute modification (création, mise à jour, suppression) pour garantir la fraîcheur des données
3. **Gestion des erreurs** - Des messages d'erreur clairs sont journalisés en cas de problème avec Redis

#### Exemple d'implémentation :

```javascript
// GET /api/publications — avec cache
router.get('/', async (req, res) => {
    try {
        const cachedPosts = await cache.get('posts');
        if (cachedPosts) {
            console.log('✅ Récupéré depuis Redis');
            return res.json(JSON.parse(cachedPosts));
        }

        const posts = await Post.find().sort({ createdAt: -1 });
        await cache.set('posts', JSON.stringify(posts), { EX: 300 });
        console.log('📦 Données stockées dans Redis');

        res.json(posts);
    } catch (err) {
        console.error('Erreur Redis ou MongoDB:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des publications' });
    }
});
```

### Avantages de l'implémentation actuelle de Redis

1. **Performances améliorées** - Réduction significative du temps de réponse pour les requêtes fréquentes
2. **Réduction de la charge sur MongoDB** - Moins de requêtes directes à la base de données
3. **Cohérence des données** - Invalidation automatique du cache lors des modifications
4. **Monitoring intégré** - Journalisation claire des opérations Redis pour faciliter le débogage


Le frontend communique avec l'API Gateway pour accéder aux différents services. Il offre une interface utilisateur intuitive pour :
- S'inscrire et se connecter
- Consulter les publications
- Créer, modifier et supprimer ses propres publications