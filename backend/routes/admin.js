const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { protect, isAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all doctors (pending + approved)
router.get('/doctors', protect, isAdmin, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve or reject a doctor
router.put('/doctors/:id/approve', protect, isAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const doctor = await User.findByIdAndUpdate(req.params.id, { isApproved }, { new: true }).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Activate / Deactivate a user
router.put('/users/:id/toggle', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor', isApproved: true });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', isApproved: false });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    res.json({ totalPatients, totalDoctors, pendingDoctors, totalAppointments, pendingAppointments, completedAppointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
