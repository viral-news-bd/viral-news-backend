require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

/* =======================
   Database
======================= */
connectDB();

/* =======================
   Security Middleware
======================= */

// Basic security headers
app.use(helmet());

// CORS (adjust domain later)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Limit JSON payload size (DoS protection)
app.use(express.json({ limit: '10kb' }));

/* =======================
   Rate Limiting
======================= */

// Global rate limit (all APIs)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                // 100 requests per IP
  message: { message: 'Too many requests, try again later' }
});

// Strict rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 login/register attempts
  message: { message: 'Too many login attempts, try again later' }
});

app.use(globalLimiter);

/* =======================
   Health Check
======================= */
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running 🚀' });
});

/* =======================
   Routes
======================= */

// Apply strict limiter only on auth routes
app.use('/api/auth', authLimiter, require('./routes/auth'));

app.use('/api/premium', require('./routes/premium'));

/* =======================
   404 Handler
======================= */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* =======================
   Global Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

/* =======================
   Server
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
