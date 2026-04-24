const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  symptoms: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  doctorNote: { type: String, trim: true },
  prescription: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
