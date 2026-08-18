require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createOperator = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    const existingOperator = await User.findOne({
      email: 'operator@jaltrack.com',
    });

    if (existingOperator) {
      console.log('Operator already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      'operator123',
      10
    );

    const operator = await User.create({
      name: 'Village Operator',
      email: 'operator@jaltrack.com',
      password: hashedPassword,
      role: 'OPERATOR',
      isActive: true,
    });

    console.log('Operator created successfully');
    console.log('Email:', operator.email);
    console.log('Password: operator123');

    process.exit();

  } catch (error) {
    console.error('Failed to create operator:', error);
    process.exit(1);
  }
};

createOperator();