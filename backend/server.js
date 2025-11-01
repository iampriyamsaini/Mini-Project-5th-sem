const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Import models
const User = require('./models/User');
const EmotionRecord = require('./models/EmotionRecord');
const Alert = require('./models/Alert');
const TherapySession = require('./models/TherapySession');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const emotionRoutes = require('./routes/emotions');
const alertRoutes = require('./routes/alerts');
const therapyRoutes = require('./routes/therapy');
const caregiverRoutes = require('./routes/caregivers');
const aiRoutes = require('./routes/ai');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/therapy-sessions', therapyRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'MindCare AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EmotionBase';

// More detailed connection handling
const connectDB = async () => {
  try {
    // Add connection options
    const options = {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    };

    // Print connection attempt
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('🌐 Using database:', options.dbName);

    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log('\n✅ MongoDB Connected Successfully');
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    console.log('🔐 SSL Enabled: Yes\n');
    
    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    
    // Handle specific error types
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 Server Selection Error - Possible causes:');
      console.error('  1. MongoDB Atlas cluster is paused');
      console.error('  2. IP address not whitelisted');
      console.error('  3. Network/firewall blocking connection');
      console.error('  4. Invalid connection string');
    }
    
    console.error('\n📝 Error Details:', {
      name: error.name,
      message: error.message,
      code: error.code || 'N/A'
    });

    if (error.cause) {
      console.error('\n🔍 Additional Error Information:');
      console.error(error.cause);
    }

    // Exit with failure
    process.exit(1);
  }
};

// Initialize connection
connectDB();

module.exports = app;
