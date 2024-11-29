import React, { useEffect, useContext, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faUserCircle, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../utils/context/AuthContext';
import './Client.css';

function Client() {
    const { auth, clearAuthData } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const sidebar = document.querySelector('.sidebar');
        const button = document.querySelector('.button');
        const closeButton = document.querySelector('.close-sidebar');
        const coverSidebar = document.querySelector('.cover-sidebar');

        header.classList.add('header-visible');
        footer.classList.add('footer-visible');

        const toggleSidebar = () => {
            const isSidebarVisible = sidebar.style.transform === 'translateX(0%)';
            sidebar.style.transform = isSidebarVisible ? 'translateX(100%)' : 'translateX(0%)';
            coverSidebar.style.visibility = isSidebarVisible ? 'hidden' : 'visible';
        };

        button?.addEventListener('click', toggleSidebar);
        closeButton?.addEventListener('click', toggleSidebar);

        return () => {
            button?.removeEventListener('click', toggleSidebar);
            closeButton?.removeEventListener('click', toggleSidebar);
        };
    }, []);

    const handleLogout = useCallback(() => {
        clearAuthData();
        navigate('/');
    }, [clearAuthData, navigate]);

    return (
        <main className="box">
            {/* Header Section */}
            <header>
                <h1 className="title-text" onClick={() => navigate('/home')}>
                    Welcome to MovieWebDB
                </h1>
                <button className="button">
                    <div className="button-container">
                        <div className="divnav"></div>
                        <div className="divnav"></div>
                        <div className="divnav"></div>
                    </div>
                </button>
            </header>

            {/* Main Content */}
            <article className="main-content">
                <Outlet />
            </article>

            {/* Footer Section */}
            <footer>
                <div className="text-rights">
                    <p className="size-font">
                        &copy; 2024 MovieWebDB - All rights reserved.
                        Data provided by{' '}
                        <a
                            className="link-color"
                            href="https://www.themoviedb.org"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            (TMDb)
                        </a>
                    </p>
                    <p className="size-font">
                        Developed and Created by Neil Raphael M. Ramos from BSIT - 3A
                    </p>
                </div>
            </footer>

            {/* Sidebar Section */}
            <div className="cover-sidebar"></div>
            <div className="sidebar">
                <button className="close-sidebar">
                    <FontAwesomeIcon icon={faCaretRight} />
                </button>
                <div className="container-user-info">
                    <div className="User-Info">
                        <FontAwesomeIcon icon={faUserCircle} className="photo-user-img" />
                        <div className="user-info-data">
                            <h1 className="name-user">{auth.user.firstName}</h1>
                            <p className="role-user">
                                Role as: <strong>{auth.user.role}</strong>
                            </p>
                        </div>
                    </div>
                </div>
                <hr className="space-from-name-nav" />
                <ul className="nav-user">
                    <li
                        className="Movies-user"
                        onClick={() => navigate('/home')}
                    >
                        <FontAwesomeIcon icon={faFilm} className="spacing-text" />
                        <strong className="spacing-text">Movies</strong>
                    </li>
                    <li className="logout-user" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="spacing-text" />
                        <strong className="spacing-text">Logout</strong>
                    </li>
                </ul>
            </div>
        </main>
    );
}

export default Client;
