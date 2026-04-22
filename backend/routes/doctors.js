const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get all approved doctors (public)
router.get('/', async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = { role: 'doctor', isApproved: true, isActive: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    const doctors = await User.find(filter).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Doctor updates their own profile
router.put('/profile/update', protect, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctors only' });
  try {
    const { specialization, qualifications, experience, fees, phone, availableSlots } = req.body;
    const doctor = await User.findByIdAndUpdate(req.user._id,
      { specialization, qualifications, experience, fees, phone, availableSlots },
      { new: true }
    ).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
