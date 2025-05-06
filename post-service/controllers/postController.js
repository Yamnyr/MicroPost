const Post = require('../models/postModel');
const axios = require('axios');

// Créer un post
const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        const userId = req.user.userId;

        const newProduct = new Product({ name, price, userId });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err.message });
    }
};


module.exports = {
    createProduct
};
