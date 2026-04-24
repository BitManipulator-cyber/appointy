const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: { type: String, trim: true },
  // Patient-specific
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String, trim: true },
  // Doctor-specific
  specialization: { type: String, trim: true },
  qualifications: { type: String, trim: true },
  experience: { type: Number, min: 0 },
  fees: { type: Number, min: 0 },
  availableSlots: [{
    day: { type: String, trim: true },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true }
  }],
  isApproved: { type: Boolean, default: false }, // For doctors
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
