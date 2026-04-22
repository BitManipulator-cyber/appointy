import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
      if (data.role === 'patient') navigate('/patient');
      else if (data.role === 'doctor') navigate('/doctor');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back 👋</h2>
        <p className="auth-sub">Sign in to your Appointy account</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: '1.2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.9rem' }}>
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </p>
        <div style={{ marginTop: '1rem', background: 'var(--primary-pale)', borderRadius: '8px', padding: '10px', fontSize: '.82rem', color: 'var(--text-muted)' }}>
          <strong>Demo Admin:</strong> admin@appointy.com / admin123<br />
          <em>(Run seed-admin endpoint first — see setup guide)</em>
        </div>
      </div>
    </div>
  );
}
