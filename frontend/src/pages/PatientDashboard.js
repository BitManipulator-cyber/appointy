import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchDoctors(); fetchAppointments(); }, []);

  const fetchDoctors = async () => {
    const { data } = await axios.get('/api/doctors');
    setDoctors(data);
  };

  const fetchAppointments = async () => {
    const { data } = await axios.get('/api/appointments/my');
    setAppointments(data);
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await axios.put(`/api/appointments/${id}/cancel`);
    fetchAppointments();
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="page">
      <div className="hero-banner">
        <div>
          <h2>Hello, {user.name}! 👋</h2>
          <p>Manage your appointments and find the right doctor</p>
        </div>
        <span className="hero-emoji">🩺</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">Total Appointments</div></div>
        <div className="stat-card"><div className="stat-num">{stats.pending}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-num">{stats.completed}</div><div className="stat-label">Completed</div></div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'doctors' ? 'active' : ''}`} onClick={() => setTab('doctors')}>🔍 Find Doctors</button>
        <button className={`tab ${tab === 'appointments' ? 'active' : ''}`} onClick={() => setTab('appointments')}>📅 My Appointments</button>
      </div>

      {tab === 'doctors' && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <input className="form-control" placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '400px' }} />
          </div>
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No doctors found.</div>
          ) : (
            <div className="doctor-grid">
              {filtered.map(doc => (
                <div key={doc._id} className="doctor-card">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <div className="doctor-name">Dr. {doc.name}</div>
                  <div className="doctor-spec">{doc.specialization}</div>
                  <div className="doctor-info">🎓 {doc.qualifications}</div>
                  <div className="doctor-info">💼 {doc.experience} yrs experience</div>
                  <div className="doctor-info">📞 {doc.phone || 'N/A'}</div>
                  <div style={{ marginTop: '.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{doc.fees}</span>
                    <Link to={`/book/${doc._id}`} className="btn btn-primary btn-sm">Book Now</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'appointments' && (
        <div className="card">
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No appointments yet. <button className="btn btn-outline btn-sm" onClick={() => setTab('doctors')}>Find a Doctor</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th><th>Specialization</th><th>Date</th><th>Time</th><th>Status</th><th>Note</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a._id}>
                      <td><strong>Dr. {a.doctor?.name}</strong></td>
                      <td>{a.doctor?.specialization}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td><span className={`status status-${a.status}`}>{a.status}</span></td>
                      <td style={{ maxWidth: '180px', fontSize: '.85rem', color: 'var(--text-muted)' }}>{a.doctorNote || '—'}</td>
                      <td>
                        {(a.status === 'pending' || a.status === 'approved') && (
                          <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(a._id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
