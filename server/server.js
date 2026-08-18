require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const PORT = process.env.PORT || 5000;

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'JalTrack API is running'
  });
});

// ================= AUTHENTICATION =================
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

// Admin authentication routes
app.use('/api/admin/auth', adminAuthRoutes);

// ================= OPERATOR ROUTES =================
const operatorWaterSupplyRoutes = require('./routes/waterSupply');
const operatorWaterQualityRoutes = require('./routes/waterQuality');
const operatorComplaintRoutes = require('./routes/complaints');
const operatorPumpRoutes = require('./routes/pumps');
const operatorMaintenanceRoutes = require('./routes/maintenance');
const operatorChargeRoutes = require('./routes/charges');

app.use('/api/water-supply', operatorWaterSupplyRoutes);
app.use('/api/water-quality', operatorWaterQualityRoutes);
app.use('/api/complaints', operatorComplaintRoutes);
app.use('/api/pumps', operatorPumpRoutes);
app.use('/api/maintenance', operatorMaintenanceRoutes);
app.use('/api/charges', operatorChargeRoutes);

// ================= VILLAGER ROUTES =================
const villagerComplaintRoutes = require('./routes/complaintRoutes');
const villagerWaterSupplyRoutes = require('./routes/waterSupplyRoutes');

app.use('/api/villager/complaints', villagerComplaintRoutes);
app.use('/api/villager/water-supplies', villagerWaterSupplyRoutes);

// ================= ADMIN ROUTES =================
const userRoutes = require('./routes/userRoutes');
const villageRoutes = require('./routes/villageRoutes');
const auditRoutes = require('./routes/auditRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminPumpRoutes = require('./routes/pumpRoutes');
const adminWaterSupplyRoutes = require('./routes/waterSupplyRoutes');
const adminWaterQualityRoutes = require('./routes/waterQualityRoutes');
const adminMaintenanceRoutes = require('./routes/maintenanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/users', userRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin/pumps', adminPumpRoutes);
app.use('/api/admin/water-supply', adminWaterSupplyRoutes);
app.use('/api/admin/water-quality', adminWaterQualityRoutes);
app.use('/api/admin/maintenance', adminMaintenanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// ================= 404 HANDLER =================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});