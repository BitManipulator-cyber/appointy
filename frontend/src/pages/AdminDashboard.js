import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (tab === 'doctors') fetchDoctors();
    if (tab === 'patients') fetchUsers();
    if (tab === 'appointments') fetchAppointments();
  }, [tab]);

  const fetchStats = async () => { const { data } = await axios.get('/api/admin/stats'); setStats(data); };
  const fetchDoctors = async () => { const { data } = await axios.get('/api/admin/doctors'); setDoctors(data); };
  const fetchUsers = async () => { const { data } = await axios.get('/api/admin/users'); setUsers(data.filter(u => u.role === 'patient')); };
  const fetchAppointments = async () => { const { data } = await axios.get('/api/appointments/all'); setAppointments(data); };

  const toggleApprove = async (id, current) => {
    await axios.put(`/api/admin/doctors/${id}/approve`, { isApproved: !current });
    fetchDoctors(); fetchStats();
  };

  const toggleUser = async (id) => {
    await axios.put(`/api/admin/users/${id}/toggle`);
    fetchUsers();
  };

  return (
    <div className="page">
      <div className="hero-banner">
        <div>
          <h2>Admin Dashboard 🛡️</h2>
          <p>Manage doctors, patients, and appointments</p>
        </div>
        <span className="hero-emoji">⚙️</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num">{stats.totalPatients ?? '—'}</div><div className="stat-label">Total Patients</div></div>
        <div className="stat-card"><div className="stat-num">{stats.totalDoctors ?? '—'}</div><div className="stat-label">Approved Doctors</div></div>
        <div className="stat-card"><div className="stat-num">{stats.pendingDoctors ?? '—'}</div><div className="stat-label">Pending Approvals</div></div>
        <div className="stat-card"><div className="stat-num">{stats.totalAppointments ?? '—'}</div><div className="stat-label">Total Appointments</div></div>
        <div className="stat-card"><div className="stat-num">{stats.pendingAppointments ?? '—'}</div><div className="stat-label">Pending Appts</div></div>
        <div className="stat-card"><div className="stat-num">{stats.completedAppointments ?? '—'}</div><div className="stat-label">Completed Appts</div></div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>📊 Overview</button>
        <button className={`tab ${tab === 'doctors' ? 'active' : ''}`} onClick={() => setTab('doctors')}>👨‍⚕️ Doctors</button>
        <button className={`tab ${tab === 'patients' ? 'active' : ''}`} onClick={() => setTab('patients')}>🧑 Patients</button>
        <button className={`tab ${tab === 'appointments' ? 'active' : ''}`} onClick={() => setTab('appointments')}>📅 Appointments</button>
      </div>

      {tab === 'overview' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>System Overview</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Welcome to the Appointy Admin Panel. Use the tabs above to:<br />
            • <strong>Doctors</strong> — Approve or reject doctor registrations<br />
            • <strong>Patients</strong> — View and manage patient accounts<br />
            • <strong>Appointments</strong> — View all bookings across the platform
          </p>
        </div>
      )}

      {tab === 'doctors' && (
        <div className="card">
          <div className="card-header"><h3>All Doctors</h3></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Experience</th><th>Fee</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d._id}>
                    <td><strong>Dr. {d.name}</strong></td>
                    <td>{d.email}</td>
                    <td>{d.specialization}</td>
                    <td>{d.experience} yrs</td>
                    <td>₹{d.fees}</td>
                    <td>
                      <span className={`status ${d.isApproved ? 'status-approved' : 'status-pending'}`}>
                        {d.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${d.isApproved ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleApprove(d._id, d.isApproved)}>
                        {d.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'patients' && (
        <div className="card">
          <div className="card-header"><h3>All Patients</h3></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Age</th><th>Gender</th><th>Blood</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{u.age || '—'}</td>
                    <td>{u.gender || '—'}</td>
                    <td>{u.bloodGroup || '—'}</td>
                    <td><span className={`status ${u.isActive ? 'status-approved' : 'status-rejected'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleUser(u._id)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'appointments' && (
        <div className="card">
          <div className="card-header"><h3>All Appointments</h3></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Patient</th><th>Doctor</th><th>Specialization</th><th>Date</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td>{a.patient?.name}</td>
                    <td>Dr. {a.doctor?.name}</td>
                    <td>{a.doctor?.specialization}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td><span className={`status status-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
