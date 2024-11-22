import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faTachometerAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');

  //get user info
  const userInformation = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, []);

  return (
    <div className="Main">
      <div className="custom-container">
        <div className="navigation bg-dark text-light">
          <div className="admin-info">
            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '50px', color: 'white' }} />
            <span className="user-info">
              <p className="role">{userInformation.role}</p>
              <h1 className="name">{userInformation.firstName}</h1>
            </span>
          </div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a href="/main/dashboard" className="nav-link" title="Dashboard">
                <center>
                  <FontAwesomeIcon icon={faTachometerAlt} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
            <li className="nav-item">
              <a href="/main/movies" className="nav-link" title="Movies">
                <center>
                  <FontAwesomeIcon icon={faFilm} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
            <li className="nav-item logout" title="Logout">
              <a onClick={handleLogout} className="nav-link">
                <center>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
          </ul>
        </div>
        <div className="outlet bg-custom text-light">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
