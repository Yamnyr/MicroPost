const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Redirection vers le User Service
app.use('/api/users', createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/users',
    },
}));

// Redirection vers le postService
app.use('/api/posts', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/posts': '/posts',
    },
}));

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway démarrée sur le port ${PORT}`);
});
