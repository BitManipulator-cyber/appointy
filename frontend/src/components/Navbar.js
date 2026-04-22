import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const dashboardLink = user?.role === 'patient' ? '/patient' : user?.role === 'doctor' ? '/doctor' : '/admin';

  return (
    <nav className="navbar">
      <Link to={user ? dashboardLink : '/'} className="navbar-brand">
        🏥 Appointy<span>.</span>
      </Link>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to={dashboardLink} className="nav-link">Dashboard</Link>
            <span className="badge-role">{user.role}</span>
            <span style={{ color: '#374151', fontWeight: 600 }}>{user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
