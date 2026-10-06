import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmModal from './components/ConfirmModal';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');

    if (token) {
      if (userData) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(JSON.parse(userData));
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsAuthenticated(true);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsAdmin(false);
        } catch (error) {
          console.error('Ошибка парсинга данных пользователя', error);
        }
      } else if (adminData) {
        try {
          const admin = JSON.parse(adminData);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAdminName(admin.name);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsAuthenticated(true);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsAdmin(true);
        } catch (error) {
          console.error('Ошибка парсинга данных администратора', error);
        }
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAdmin(false);
    }
  }, [location]);

  const scrollToFeatures = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('features-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setShowLogoutModal(false);
    navigate('/');
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      WebkitBackdropFilter: 'blur(15px)',
      backdropFilter: 'blur(15px)',
      background: 'rgba(10, 10, 11, 0.7)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        
        <div 
          className="logo" 
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800', 
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: 'Montserrat',
            transition: 'all 0.3s ease'
          }}
        >
          NEO<span style={{ color: '#88d3ce' }}>BANK</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          
          <span 
            className="nav-link" 
            onClick={scrollToFeatures}
            style={{ cursor: 'pointer', color: 'white', fontWeight: '500' }}
          >
            Возможности
          </span>

          <span 
            className="nav-link" 
            onClick={() => navigate('/security')}
            style={{ cursor: 'pointer', color: 'white', fontWeight: '500' }}
          >
            Безопасность
          </span>

          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <span 
                    className="nav-link" 
                    onClick={() => navigate('/admin')}
                    style={{ cursor: 'pointer', color: '#88d3ce', fontWeight: '700' }}
                  >
                    Панель управления
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{adminName}</span>
                </>
              ) : (
                <>
                  <span 
                    className="nav-link" 
                    onClick={() => navigate('/dashboard')}
                    style={{ cursor: 'pointer', color: 'white', fontWeight: '500' }}
                  >
                    {user?.firstName || 'Аккаунт'}
                  </span>
                </>
              )}
              <button 
                onClick={openLogoutModal}
                style={{
                  padding: '10px 28px',
                  borderRadius: '25px',
                  border: '1px solid #6e45e2',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  marginLeft: '20px',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6e45e2';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(110, 69, 226, 0.6)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  padding: '10px 28px',
                  borderRadius: '25px',
                  border: '1px solid #6e45e2',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  marginLeft: '20px',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6e45e2';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(110, 69, 226, 0.6)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Вход для пользователей
              </button>
              <button 
                onClick={() => navigate('/admin-login')}
                style={{
                  padding: '10px 28px',
                  borderRadius: '25px',
                  border: '1px solid #6e45e2',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  marginLeft: '10px',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6e45e2';
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(110, 69, 226, 0.6)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Вход для администратора
              </button>
            </>
          )}
        </nav>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={closeLogoutModal}
        title="Выход"
        message="Вы уверены, что хотите выйти?"
      />
    </header>
  );
};

export default Header;