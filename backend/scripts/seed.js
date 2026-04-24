require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const seed = async () => {
  try {
    await connectDB();

    await Appointment.deleteMany({});
    await User.deleteMany({ email: { $in: ['admin@appointy.com', 'doctor@appointy.com', 'patient@appointy.com'] } });

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@appointy.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true,
      isActive: true
    });

    const doctor = await User.create({
      name: 'Dr. Priya Sharma',
      email: 'doctor@appointy.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '9876543210',
      specialization: 'Cardiologist',
      qualifications: 'MBBS, MD',
      experience: 8,
      fees: 700,
      isApproved: true,
      isActive: true
    });

    const patient = await User.create({
      name: 'Rahul Verma',
      email: 'patient@appointy.com',
      password: 'patient123',
      role: 'patient',
      phone: '9876501234',
      age: 31,
      gender: 'Male',
      bloodGroup: 'O+',
      isApproved: true,
      isActive: true
    });

    await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date: '2026-05-01',
      time: '10:30 AM',
      symptoms: 'Mild chest pain while climbing stairs',
      status: 'pending'
    });

    console.log('Seed complete:');
    console.log(`- Admin: ${admin.email} / admin123`);
    console.log(`- Doctor: ${doctor.email} / doctor123`);
    console.log(`- Patient: ${patient.email} / patient123`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
