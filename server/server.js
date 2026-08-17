require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const complaintRoutes = require('./routes/complaintRoutes');
const waterSupplyRoutes = require('./routes/waterSupplyRoutes');

// Register Mongoose models
require('./models/User');
require('./models/Village');
require('./models/Complaint');
require('./models/WaterSupply');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Complaint routes
app.use('/api/complaints', complaintRoutes);

// Water Supply routes
app.use('/api/water-supply', waterSupplyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'JalTrack API is running'
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });