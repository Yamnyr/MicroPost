const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const cache = require('../services/cache');
const auth = require('../middleware/auth');

// GET /api/publications — avec cache
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    try {
        const cachedPosts = await cache.get('posts');
        if (cachedPosts) {
            console.log('✅ Récupéré depuis Redis');
            return res.json(JSON.parse(cachedPosts));
        }

        const posts = await Post.find().sort({ createdAt: -1 });

        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                const user = await userService.getUserById(post.userId);
                return {
                    ...post.toObject(),
                    user: user ? { name: user.name, email: user.email } : null,
                };
            })
        );

        await cache.set('posts', JSON.stringify(enrichedPosts), { EX: 300 });
        console.log('📦 Données enrichies stockées dans Redis');

        res.json(enrichedPosts);
    } catch (err) {
        console.error('Erreur Redis ou MongoDB:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des publications' });
    }
});


// GET /api/publications/:id — lire un post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Publication introuvable' });

        const user = await userService.getUserById(post.userId);

        res.json({
            ...post.toObject(),
            user: user ? { name: user.name, email: user.email } : null,
        });
    } catch (err) {
        console.error('Erreur récupération publication:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de la publication' });
    }
});

// POST /api/publications — créer un post
router.post('/', auth, async (req, res) => {
    try {
        const { content, userId } = req.body;
        const post = new Post({ content, userId });
        await post.save();
        await cache.del('posts');
        res.status(201).json(post);
    } catch (err) {
        console.error('Erreur création publication:', err);
        res.status(500).json({ message: 'Erreur lors de la création de la publication' });
    }
});

// PUT /api/publications/:id — modifier un post
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: 'Publication introuvable' });
        await cache.del('posts');
        res.json(updatedPost);
    } catch (err) {
        console.error('Erreur modification publication:', err);
        res.status(500).json({ message: 'Erreur lors de la modification de la publication' });
    }
});

// DELETE /api/publications/:id — supprimer un post
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Publication introuvable' });
        await cache.del('posts');
        res.json({ message: 'Publication supprimée avec succès' });
    } catch (err) {
        console.error('Erreur suppression publication:', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la publication' });
    }
});

module.exports = router;
