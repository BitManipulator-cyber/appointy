import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', age:'', gender:'', bloodGroup:'', specialization:'', qualifications:'', experience:'', fees:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', { ...form, role });
      login(data);
      if (role === 'patient') navigate('/patient');
      else navigate('/doctor');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join Appointy as a patient or doctor</p>

        {/* Role Toggle */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem' }}>
          {['patient','doctor'].map(r => (
            <button key={r} type="button"
              className={`btn ${role===r ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex:1 }} onClick={() => setRole(r)}>
              {r === 'patient' ? '🧑‍⚕️ Patient' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        {error && <div className="error-msg">{error}</div>}
        {role === 'doctor' && <div className="success-msg">⚠️ Doctor accounts need admin approval before login is active.</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="min 6 chars" />
            </div>
          </div>

          {role === 'patient' && (
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input className="form-control" type="number" name="age" value={form.age} onChange={handleChange} placeholder="25" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="form-control" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select className="form-control" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Specialization</label>
                  <input className="form-control" name="specialization" value={form.specialization} onChange={handleChange} required placeholder="e.g. Cardiologist" />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input className="form-control" type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="5" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Qualifications</label>
                  <input className="form-control" name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="MBBS, MD" />
                </div>
                <div className="form-group">
                  <label>Consultation Fee (₹)</label>
                  <input className="form-control" type="number" name="fees" value={form.fees} onChange={handleChange} placeholder="500" />
                </div>
              </div>
            </>
          )}

          <button className="btn btn-primary" style={{ width:'100%', marginTop:'.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop:'1.2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'.9rem' }}>
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
