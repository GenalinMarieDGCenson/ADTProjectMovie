import { useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faTachometerAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Main.css';

function Main() {
  const { auth, clearAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleResetTab = () => {
    localStorage.setItem('tab', JSON.stringify('cast'));
  };

  const handleLogout = useCallback(() => {
    clearAuthData();
    navigate('/');
  }, [navigate, clearAuthData]);

  useEffect(() => {
    if (!auth.accessToken) {
      handleLogout();
    }
  }, [auth.accessToken, handleLogout]);

  return (
    <div className="Main">
      <div className="custom-container">
        {}
        <div className="navigation bg-dark text-light">
          <div className="admin-info">
            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '50px', color: '#ffffff' }} />
            <div className="user-info">
              <p className="role">{auth.user.role}</p>
              <h1 className="name">{auth.user.firstName}</h1>
            </div>
          </div>
          <hr />
          <ul className="nav">
            {}
            <li>
              <a href="/main/dashboard" className="nav-link" title="Dashboard">
                <center>
                  <FontAwesomeIcon icon={faTachometerAlt} style={{ fontSize: '24px', color: '#ffffff' }} />
                </center>
              </a>
            </li>
            {}
            <li>
              <a href="/main/movies" className="nav-link" title="Movies" onClick={handleResetTab}>
                <center>
                  <FontAwesomeIcon icon={faFilm} style={{ fontSize: '24px', color: '#ffffff' }} />
                </center>
              </a>
            </li>
            {}
            <li className="logout" title="Logout">
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none' }}>
                <center>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '24px', color: '#ffffff' }} />
                </center>
              </button>
            </li>
          </ul>
        </div>
        {}
        <div className="outlet bg-custom text-light">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
