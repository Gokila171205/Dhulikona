require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/complaints', complaintRoutes);

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JalTrack API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});