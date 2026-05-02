const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = 4000;
const JWT_SECRET = process.env.JWT_SECRET;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: {
    status: 429,
    message: "Terlalu banyak request, coba lagi nanti."
  }
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token diperlukan!' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid atau expired!' });

  req.headers['x-user-id'] = String(user.id || '');
  req.headers['x-user-role'] = String(user.role || 'user');
  next();
  });
};

app.use(limiter);

app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:5001',
  changeOrigin: true,
}));

app.use('/api/kos/bookings', verifyJWT, createProxyMiddleware({
    target: 'http://booking-service:5002',
    changeOrigin: true,
}));

app.use('/api/kos', (req, res, next) => {
    if (req.method === 'GET') return next();
    verifyJWT(req, res, next);
}, createProxyMiddleware({
    target: 'http://kos-service:8000',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/',
    },
}));

app.listen(PORT, () => {
  console.log(`API Gateway jalan di port ${PORT}`);
});
