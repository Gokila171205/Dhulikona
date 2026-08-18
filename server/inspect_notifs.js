require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('Connecting to', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    // Get Admin user id
    const admin = await User.findOne({ phone: '9999999999' });
    if (admin) {
      console.log('Admin User found:', admin._id, admin.name, admin.role);
    } else {
      console.log('Admin User NOT found');
    }

    const notifCount = await Notification.countDocuments();
    console.log('\n--- NOTIFICATIONS ---');
    console.log('Count:', notifCount);
    if (notifCount > 0) {
      const allNotifs = await Notification.find().populate('userId', 'name role phone').lean();
      console.log('All Notifications:', JSON.stringify(allNotifs, null, 2));
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected.');
  }
}

run();
