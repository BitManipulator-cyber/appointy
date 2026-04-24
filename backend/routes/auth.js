const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, age, gender, bloodGroup,
            specialization, qualifications, experience, fees } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name, email, password, role, phone, age, gender, bloodGroup,
      specialization, qualifications, experience, fees,
      isApproved: role === 'doctor' ? false : true
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, isApproved: user.isApproved,
      phone: user.phone,
      specialization: user.specialization,
      qualifications: user.qualifications,
      experience: user.experience,
      fees: user.fees,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated. Contact admin.' });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, isApproved: user.isApproved,
      phone: user.phone,
      specialization: user.specialization,
      qualifications: user.qualifications,
      experience: user.experience,
      fees: user.fees,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged in user profile
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// Seed admin (run once)
router.post('/seed-admin', async (req, res) => {
  const exists = await User.findOne({ role: 'admin' });
  if (exists) return res.status(400).json({ message: 'Admin already exists' });
  const admin = await User.create({
    name: 'Admin', email: 'admin@appointy.com',
    password: 'admin123', role: 'admin', isApproved: true
  });
  res.json({ message: 'Admin created', email: admin.email });
});

module.exports = router;
