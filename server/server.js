require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const waterSupplyRoutes = require('./routes/waterSupply');
const waterQualityRoutes = require('./routes/waterQuality');
const complaintRoutes = require('./routes/complaints');
const pumpRoutes = require('./routes/pumps');
const maintenanceRoutes = require('./routes/maintenance');
const chargeRoutes = require('./routes/charges');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Authentication
app.use('/api/auth', authRoutes);

// Existing routes
app.use('/api/water-supply', waterSupplyRoutes);
app.use('/api/water-quality', waterQualityRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pumps', pumpRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/charges', chargeRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });


