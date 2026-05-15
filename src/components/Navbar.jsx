import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">EduPortal</Link>
      </div>
      <div className="navbar-links">
        {!currentUser ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary-sm">Register</Link>
          </>
        ) : (
          <>
            {userRole === 'admin' && (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            )}
            {userRole === 'student' && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
            <span className="user-email">{currentUser.email}</span>
            <button onClick={handleLogout} className="btn-secondary-sm">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
