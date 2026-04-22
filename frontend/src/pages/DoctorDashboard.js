import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('appointments');
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [prescription, setPrescription] = useState('');
  const [profile, setProfile] = useState({ specialization: '', qualifications: '', experience: '', fees: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => { fetchAppointments(); loadProfile(); }, []);

  const fetchAppointments = async () => {
    const { data } = await axios.get('/api/appointments/doctor');
    setAppointments(data);
  };

  const loadProfile = () => {
    setProfile({
      specialization: user.specialization || '',
      qualifications: user.qualifications || '',
      experience: user.experience || '',
      fees: user.fees || '',
      phone: user.phone || '',
    });
  };

  const updateStatus = async (id, status) => {
    await axios.put(`/api/appointments/${id}/status`, { status, doctorNote: noteText, prescription });
    setNoteModal(null); setNoteText(''); setPrescription('');
    fetchAppointments();
  };

  const saveProfile = async e => {
    e.preventDefault();
    await axios.put('/api/doctors/profile/update', profile);
    setProfileMsg('Profile updated successfully!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  if (!user.isApproved) {
    return (
      <div className="page" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ fontSize: '4rem' }}>⏳</div>
        <h2 style={{ color: 'var(--primary)', margin: '1rem 0 .5rem' }}>Account Pending Approval</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your doctor account is under review by the admin. You'll be able to access your dashboard once approved.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero-banner">
        <div>
          <h2>Dr. {user.name} 🩺</h2>
          <p>{user.specialization} · Manage your appointments below</p>
        </div>
        <span className="hero-emoji">🏥</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">Total Appointments</div></div>
        <div className="stat-card"><div className="stat-num">{stats.pending}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card"><div className="stat-num">{stats.approved}</div><div className="stat-label">Approved</div></div>
        <div className="stat-card"><div className="stat-num">{stats.completed}</div><div className="stat-label">Completed</div></div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'appointments' ? 'active' : ''}`} onClick={() => setTab('appointments')}>📅 Appointments</button>
        <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>👤 My Profile</button>
      </div>

      {tab === 'appointments' && (
        <div className="card">
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No appointments yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Patient</th><th>Age/Gender</th><th>Date</th><th>Time</th><th>Symptoms</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a._id}>
                      <td><strong>{a.patient?.name}</strong><br /><span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{a.patient?.phone}</span></td>
                      <td>{a.patient?.age}y / {a.patient?.gender}</td>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td style={{ maxWidth: '160px', fontSize: '.85rem' }}>{a.symptoms || '—'}</td>
                      <td><span className={`status status-${a.status}`}>{a.status}</span></td>
                      <td>
                        {a.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '.4rem' }}>
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(a._id, 'approved')}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a._id, 'rejected')}>Reject</button>
                          </div>
                        )}
                        {a.status === 'approved' && (
                          <button className="btn btn-primary btn-sm" onClick={() => { setNoteModal(a._id); setNoteText(a.doctorNote || ''); setPrescription(a.prescription || ''); }}>
                            Complete
                          </button>
                        )}
                        {(a.status === 'completed') && a.doctorNote && (
                          <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>📝 {a.doctorNote}</span>
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

      {tab === 'profile' && (
        <div className="card" style={{ maxWidth: '560px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Update Profile</h3>
          {profileMsg && <div className="success-msg">{profileMsg}</div>}
          <form onSubmit={saveProfile}>
            <div className="form-row">
              <div className="form-group">
                <label>Specialization</label>
                <input className="form-control" value={profile.specialization} onChange={e => setProfile({ ...profile, specialization: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Qualifications</label>
                <input className="form-control" value={profile.qualifications} onChange={e => setProfile({ ...profile, qualifications: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Experience (years)</label>
                <input className="form-control" type="number" value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input className="form-control" type="number" value={profile.fees} onChange={e => setProfile({ ...profile, fees: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit">Save Changes</button>
          </form>
        </div>
      )}

      {/* Complete Appointment Modal */}
      {noteModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div className="card" style={{ width:'100%', maxWidth:'460px' }}>
            <h3 style={{ marginBottom:'1rem' }}>Complete Appointment</h3>
            <div className="form-group">
              <label>Doctor's Note</label>
              <textarea className="form-control" rows={3} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Diagnosis, advice..." />
            </div>
            <div className="form-group">
              <label>Prescription</label>
              <textarea className="form-control" rows={3} value={prescription} onChange={e => setPrescription(e.target.value)} placeholder="Medicines, dosage..." />
            </div>
            <div style={{ display:'flex', gap:'.5rem', justifyContent:'flex-end', marginTop:'1rem' }}>
              <button className="btn btn-outline" onClick={() => setNoteModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={() => updateStatus(noteModal, 'completed')}>Mark Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
