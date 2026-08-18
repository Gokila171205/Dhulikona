require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Existing JalTrack routes
const waterSupplyRoutes = require('./routes/waterSupply');
const waterQualityRoutes = require('./routes/waterQuality');
const complaintRoutes = require('./routes/complaints');
const pumpRoutes = require('./routes/pumps');
const maintenanceRoutes = require('./routes/maintenance');
const chargeRoutes = require('./routes/charges');
const authRoutes = require('./routes/auth');

// Villager routes
const villagerComplaintRoutes = require('./routes/complaintRoutes');
const villagerWaterSupplyRoutes = require('./routes/waterSupplyRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'JalTrack API is running'
  });
});

// Authentication
app.use('/api/auth', authRoutes);

// Existing Operator routes
app.use('/api/water-supply', waterSupplyRoutes);
app.use('/api/water-quality', waterQualityRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pumps', pumpRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/charges', chargeRoutes);

// Villager routes
app.use('/api/villager/complaints', villagerComplaintRoutes);
app.use('/api/villager/water-supplies', villagerWaterSupplyRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });