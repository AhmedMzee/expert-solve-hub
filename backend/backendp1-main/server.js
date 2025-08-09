const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - IMPORTANT FOR REACT NATIVE
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// Default route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'ExpertSolve Hub API Server is running!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/users/experts',
      'GET /api/challenges',
      'GET /api/questions'
    ]
  });
});

// Test route for connection testing
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Backend connection successful!',
    timestamp: new Date().toISOString()
  });
});

// CRITICAL: Listen on all interfaces (0.0.0.0) not just localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://192.168.188.156:${PORT}`);
  console.log('Make sure your phone and computer are on the same network!');
});