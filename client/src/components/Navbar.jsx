import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="flex items-center gap-2 text-xl">
          <CheckSquare size={24} className="text-primary" />
          <span>TeamTask</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/projects">Projects</Link>
              <div className="flex items-center gap-4 ml-4">
                <span className="text-sm text-muted">Hi, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary text-sm">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
