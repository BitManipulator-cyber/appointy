import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', symptoms: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
    '12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'];

  useEffect(() => {
    axios.get(`/api/doctors/${doctorId}`).then(r => setDoctor(r.data)).catch(() => navigate('/patient'));
  }, [doctorId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post('/api/appointments', { doctorId, ...form });
      setSuccess('Appointment booked successfully! Waiting for doctor approval.');
      setTimeout(() => navigate('/patient'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  if (!doctor) return <div className="loading">Loading doctor info...</div>;

  // Get today's date in YYYY-MM-DD for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page" style={{ maxWidth: '600px' }}>
      <button className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/patient')}>← Back</button>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="doctor-avatar" style={{ width: 56, height: 56, fontSize: '1.8rem' }}>👨‍⚕️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Dr. {doctor.name}</div>
            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{doctor.specialization}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{doctor.qualifications} · {doctor.experience} yrs exp</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>₹{doctor.fees}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>Consultation fee</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Book Appointment</h2>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">✅ {success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Date</label>
            <input className="form-control" type="date" value={form.date} min={today} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Select Time Slot</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.5rem' }}>
              {timeSlots.map(t => (
                <button key={t} type="button"
                  style={{ padding: '8px 4px', fontSize: '.8rem', borderRadius: '8px', border: `2px solid ${form.time === t ? 'var(--primary)' : 'var(--border)'}`, background: form.time === t ? 'var(--primary-pale)' : 'white', color: form.time === t ? 'var(--primary)' : 'var(--text)', fontWeight: form.time === t ? 700 : 400, cursor: 'pointer' }}
                  onClick={() => setForm({ ...form, time: t })}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Symptoms / Reason for Visit</label>
            <textarea className="form-control" rows={3} value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} placeholder="Describe your symptoms briefly..." />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !form.date || !form.time}>
            {loading ? 'Booking...' : '✅ Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
