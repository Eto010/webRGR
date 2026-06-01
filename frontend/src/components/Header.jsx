import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1E22AA',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none' }}>
        VideoPlatform
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/upload" style={{ color: 'white', textDecoration: 'none' }}>Загрузить</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaUserCircle size={32} color="white" />
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <FaSignOutAlt /> Выйти
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Войти</Link>
        )}
      </div>
    </nav>
  );
};

export default Header;