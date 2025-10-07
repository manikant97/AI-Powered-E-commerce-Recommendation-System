require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173', // Local development frontend (Vite default)
  'http://localhost:5174', // Local development frontend (alternative port)
  'https://ecommerce-crm.onrender.com', // Production frontend,
  'https://ecommerce-crm-eight.vercel.app',
  'https://storefront-ecommerce-crm.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Connect to MongoDB
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const app = express();

// Apply CORS with options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Parse JSON bodies
app.use(express.json());

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const aiLeadRoutes = require('./routes/aiLeadRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const port = process.env.PORT || 3000;
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use product routes
app.use('/api/auth', authRoutes);
// Product routes
app.use('/api/products', authenticateToken, productRoutes);
// Customer routes
app.use('/api/customers', authenticateToken, customerRoutes);
// Order routes
app.use('/api/orders', authenticateToken, orderRoutes);
// AI routes
app.use('/api/ai', aiLeadRoutes);

app.listen(port, () => {
  console.log(`CRM Backend listening at http://localhost:${port}`);
});
