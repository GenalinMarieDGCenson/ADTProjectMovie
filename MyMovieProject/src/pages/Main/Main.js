import React, { useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faTachometerAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Main.css';

function Main() {
  // Access authentication context and navigation
  const { auth, clearAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Logout and clear auth data
  const handleLogout = useCallback(() => {
    clearAuthData();
    navigate('/');
  }, [clearAuthData, navigate]);

  // Reset tab to default when accessing specific routes
  const handleResetTab = () => {
    localStorage.setItem('tab', JSON.stringify('cast'));
  };

  // Check authentication on component load
  useEffect(() => {
    if (!auth?.accessToken) {
      handleLogout();
    }
  }, [auth?.accessToken, handleLogout]);

  return (
    <div className="Main">
      <div className="custom-container">
        {/* Sidebar Navigation */}
        <aside className="navigation text-light">
          {/* User Info */}
          <div className="admin-info">
            <FontAwesomeIcon icon={faUserCircle} size="3x" color="white" />
            <div className="user-info">
              <p className="role">{auth?.user?.role}</p>
              <h1 className="name">{auth?.user?.firstName}</h1>
            </div>
          </div>
          <hr />

          {/* Navigation Links */}
          <nav className="nav">
            <ul>
              <li>
                <a href="/main/dashboard" className="nav-link" title="Dashboard">
                  <FontAwesomeIcon icon={faTachometerAlt} size="lg" color="white" />
                </a>
              </li>
              <li>
                <a href="/main/movies" className="nav-link" title="Movies" onClick={handleResetTab}>
                  <FontAwesomeIcon icon={faFilm} size="lg" color="white" />
                </a>
              </li>
              <li className="logout" title="Logout">
                <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none' }}>
                  <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="white" />
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content Outlet */}
        <main className="outlet bg-custom text-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Main;
