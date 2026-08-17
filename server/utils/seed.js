const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Village = require('../models/Village');
const AuditLog = require('../models/AuditLog');
const Complaint = require('../models/Complaint');
const Pump = require('../models/Pump');
const WaterSupply = require('../models/WaterSupply');
const WaterQuality = require('../models/WaterQuality');
const Maintenance = require('../models/Maintenance');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB Connection Error: ', error.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('--------------------------------------------------');
    console.log('WARNING: DESTRUCTIVE SEEDING OPERATION DETECTED!');
    console.log('Clearing all existing data in JalTrack collections...');
    console.log('--------------------------------------------------');

    await User.deleteMany();
    await Village.deleteMany();
    await AuditLog.deleteMany();
    await Complaint.deleteMany();
    await Pump.deleteMany();
    await WaterSupply.deleteMany();
    await WaterQuality.deleteMany();
    await Maintenance.deleteMany();
    await Payment.deleteMany();
    await Notification.deleteMany();

    console.log('Existing collections successfully cleared.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    // 1. Create Admins
    const admin = await User.create({
      userId: 'U-ADMIN-001',
      name: 'System Admin',
      phone: '9999999999',
      password,
      role: 'admin',
      status: 'active'
    });

    // 2. Create Operators
    const operator1 = await User.create({
      userId: 'U-OP-001',
      name: 'Ramesh Kumar',
      phone: '9876543210',
      password,
      role: 'operator',
      status: 'active'
    });

    const operator2 = await User.create({
      userId: 'U-OP-002',
      name: 'Suresh Das',
      phone: '8765432109',
      password,
      role: 'operator',
      status: 'active'
    });

    // 3. Create Villages
    const village1 = await Village.create({
      villageId: 'V-001',
      name: 'Sonapur',
      district: 'Kamrup',
      block: 'Sonapur Block',
      households: 250,
      assignedOperator: operator1._id,
      status: 'active'
    });

    const village2 = await Village.create({
      villageId: 'V-002',
      name: 'Raha',
      district: 'Nagaon',
      block: 'Raha Block',
      households: 180,
      assignedOperator: operator2._id,
      status: 'active'
    });

    const village3 = await Village.create({
      villageId: 'V-003',
      name: 'Baihata',
      district: 'Kamrup',
      block: 'Baihata Block',
      households: 130,
      assignedOperator: operator1._id,
      status: 'active'
    });

    // Link village references back to Operators
    operator1.village = village1._id;
    await operator1.save();

    operator2.village = village2._id;
    await operator2.save();

    // 4. Create Villagers
    const villager1 = await User.create({
      userId: 'U-VIL-001',
      name: 'Bina Das',
      phone: '7654321098',
      password,
      role: 'villager',
      village: village1._id,
      status: 'active'
    });

    const villager2 = await User.create({
      userId: 'U-VIL-002',
      name: 'Jadu Nath',
      phone: '6543210987',
      password,
      role: 'villager',
      village: village2._id,
      status: 'active'
    });

    const villager3 = await User.create({
      userId: 'U-VIL-003',
      name: 'Priya Kalita',
      phone: '8765400112',
      password,
      role: 'villager',
      village: village1._id,
      status: 'active'
    });

    // 5. Create Pumps
    const pump1 = await Pump.create({
      name: 'Baihata Central Pump',
      village: village3._id,
      type: 'Submersible',
      status: 'Working',
      installationDate: new Date('2021-02-18')
    });

    const pump2 = await Pump.create({
      name: 'Sonapur Water Station',
      village: village1._id,
      type: 'Submersible',
      status: 'Working',
      installationDate: new Date('2020-05-12')
    });

    const pump3 = await Pump.create({
      name: 'Sonapur East Tube Well',
      village: village1._id,
      type: 'Solar Powered',
      status: 'Under Maintenance',
      installationDate: new Date('2022-09-14')
    });

    const pump4 = await Pump.create({
      name: 'Baihata North Hand Pump',
      village: village3._id,
      type: 'Hand Pump',
      status: 'Not Working',
      installationDate: new Date('2018-05-30')
    });

    // 6. Create Complaints
    const complaint1 = await Complaint.create({
      title: 'No Water Supply in Sector 2',
      description: 'Water has been completely unavailable since yesterday morning.',
      village: village1._id,
      reportedBy: villager1._id,
      status: 'Submitted'
    });

    const complaint2 = await Complaint.create({
      title: 'Tube Well Handle Broken',
      description: 'The handle of the local hand pump is cracked and unusable.',
      village: village1._id,
      reportedBy: villager3._id,
      assignedTo: operator1._id,
      status: 'Verified'
    });

    const complaint3 = await Complaint.create({
      title: 'Chemical Odor in Supply Line',
      description: 'Water supplied in the evening contains a strong chemical smell and turbidity.',
      village: village2._id,
      reportedBy: villager2._id,
      assignedTo: operator2._id,
      status: 'Maintenance Started'
    });

    const complaint4 = await Complaint.create({
      title: 'Major pipeline leakage',
      description: 'Water is gushing out of the supply pipeline next to the block office.',
      village: village2._id,
      reportedBy: villager2._id,
      assignedTo: operator2._id,
      status: 'Resolved',
      resolvedAt: new Date()
    });

    // 7. Create Maintenance Records
    const maintenance1 = await Maintenance.create({
      pump: pump3._id,
      complaint: complaint2._id,
      assignedTo: operator1._id,
      issue: 'Replaced well cylinder assembly and gaskets.',
      priority: 'High',
      status: 'In Progress',
      startDate: '2026-08-12'
    });

    const maintenance2 = await Maintenance.create({
      pump: pump4._id,
      complaint: complaint1._id,
      assignedTo: operator2._id,
      issue: 'Complete pipe corrosion repair.',
      priority: 'Medium',
      status: 'Completed',
      startDate: '2026-08-10',
      endDate: '2026-08-11',
      remarks: 'Replaced 12 meters of main pipe.'
    });

    // 8. Create Water Supply Logs
    await WaterSupply.create({
      village: village1._id,
      supplyDate: '2026-08-12',
      scheduledStart: '16:00',
      scheduledEnd: '18:00',
      actualStart: '16:05',
      actualEnd: '18:10',
      frequency: 'Twice Daily',
      status: 'Completed',
      recordedBy: operator1._id,
      remarks: 'Normal distribution'
    });

    await WaterSupply.create({
      village: village2._id,
      supplyDate: '2026-08-12',
      scheduledStart: '08:00',
      scheduledEnd: '10:00',
      actualStart: '-',
      actualEnd: '-',
      frequency: 'Daily',
      status: 'Missed',
      recordedBy: operator2._id,
      remarks: 'Power outage at main station grid.'
    });

    // 9. Create Water Quality Tests
    await WaterQuality.create({
      village: village1._id,
      testDate: '2026-08-12',
      ph: 7.2,
      tds: 150,
      turbidity: 1.2,
      chlorine: 0.4,
      status: 'Safe',
      recordedBy: operator1._id,
      remarks: 'All parameters normal.'
    });

    await WaterQuality.create({
      village: village2._id,
      testDate: '2026-08-12',
      ph: 6.2,
      tds: 310,
      turbidity: 4.8,
      chlorine: 0.1,
      status: 'Needs Attention',
      recordedBy: operator2._id,
      remarks: 'Low chlorine residual and slightly elevated TDS.'
    });

    // 10. Create Payment Records
    await Payment.create({
      user: villager1._id,
      village: village1._id,
      amount: 300,
      dueDate: '2026-08-15',
      paidDate: '2026-08-12',
      status: 'Paid',
      paymentMethod: 'UPI',
      transactionId: 'TXN8394819034'
    });

    await Payment.create({
      user: villager2._id,
      village: village2._id,
      amount: 300,
      dueDate: '2026-08-15',
      status: 'Pending'
    });

    // 11. Create Notifications
    await Notification.create({
      userId: admin._id,
      title: 'New Complaint Filed',
      message: 'A villager from Sonapur has reported supply issues.',
      type: 'info'
    });

    await Notification.create({
      userId: villager1._id,
      title: 'Payment Confirmed',
      message: 'Your payment of ₹300 was successfully processed.',
      type: 'success'
    });

    // 12. Create Initial Audit Logs
    await AuditLog.create({
      logId: 'AL-SEED-01',
      userId: admin._id,
      userName: admin.name,
      role: 'admin',
      action: 'CREATE',
      module: 'USERS',
      description: 'System seeded successfully during initialization.',
      result: 'SUCCESS',
      village: 'Sonapur'
    });

    console.log('Seeding completed successfully!');
    console.log('Demonstration Credentials:');
    console.log('- Admin: 9999999999 / 123456');
    console.log('- Operator 1: 9876543210 / 123456 (Sonapur/Baihata)');
    console.log('- Operator 2: 8765432109 / 123456 (Raha)');
    console.log('- Villager 1: 7654321098 / 123456 (Sonapur)');
    console.log('- Villager 2: 6543210987 / 123456 (Raha)');

    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

importData();
