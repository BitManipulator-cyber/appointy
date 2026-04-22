const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, isDoctor, isPatient } = require('../middleware/auth');

// Book appointment (Patient)
router.post('/', protect, isPatient, async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;
    const appointment = await Appointment.create({
      patient: req.user._id, doctor: doctorId, date, time, symptoms
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get patient's own appointments
router.get('/my', protect, isPatient, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization fees')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel appointment (Patient)
router.put('/:id/cancel', protect, isPatient, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.patient.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    appt.status = 'cancelled';
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor's appointments
router.get('/doctor', protect, isDoctor, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name age gender phone bloodGroup')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/Reject/Complete appointment (Doctor)
router.put('/:id/status', protect, isDoctor, async (req, res) => {
  try {
    const { status, doctorNote, prescription } = req.body;
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    if (appt.doctor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    appt.status = status;
    if (doctorNote) appt.doctorNote = doctorNote;
    if (prescription) appt.prescription = prescription;
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all appointments
router.get('/all', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
