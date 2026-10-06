import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import '../components/Select.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/stats')
        ]);
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Ошибка загрузки админ-панели', err);
        if (err.response?.status === 403) {
          setError('У вас нет прав администратора');
        } else {
          setError('Ошибка загрузки данных');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleBlock = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-block`);
      setUsers(users.map(u => u.id === userId ? res.data : u));
    } catch (err) {
      console.error('Ошибка при изменении статуса', err);
      alert('Ошибка при изменении статуса');
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;
  if (error) return <div style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '100px' }}>{error}</div>;

  return (
    <div className="page-fade-in" style={{ 
      minHeight: '100vh', 
      background: '#0a0a0b', 
      color: 'white', 
      paddingTop: '100px',
      paddingLeft: '40px',
      paddingRight: '40px',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', fontWeight: '800' }}>Панель администратора</h1>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link 
            to="/admin/transactions" 
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02) translateY(-2px)';
              e.target.style.boxShadow = '0 20px 45px rgba(110, 69, 226, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Все транзакции
          </Link>
          <Link 
            to="/admin/credits" 
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02) translateY(-2px)';
              e.target.style.boxShadow = '0 20px 45px rgba(110, 69, 226, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Кредиты пользователей
          </Link>
        </div>

        {stats && (
          <div className="bento-item" style={{ padding: '30px', marginBottom: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Пользователей</div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalUsers}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Общий баланс</div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalBalance.toLocaleString()} ₽</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Транзакций</div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalTransactions}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Карт</div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalCards || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Кредитов</div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.totalCredits || 0}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bento-item" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Пользователи</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={tableHeader}>ID</th>
                  <th style={tableHeader}>Email</th>
                  <th style={tableHeader}>Имя</th>
                  <th style={tableHeader}>Роль</th>
                  <th style={tableHeader}>Баланс</th>
                  <th style={tableHeader}>Карт</th>
                  <th style={tableHeader}>Кредитов</th>
                  <th style={tableHeader}>Статус</th>
                  <th style={tableHeader}>Действия</th>
                  <th style={tableHeader}>Подробнее</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  // Определяем, есть ли хотя бы одна заблокированная карта
                  const hasBlockedCard = user.cards?.some(c => c.isBlocked);
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={tableCell}>{user.id}</td>
                      <td style={tableCell}>{user.email}</td>
                      <td style={tableCell}>{user.firstName}</td>
                      <td style={tableCell}>{user.role?.name || 'USER'}</td>
                      <td style={tableCell}>{user.balance.toLocaleString()} ₽</td>
                      <td style={tableCell}>{user.cards?.length || 0}</td>
                      <td style={tableCell}>{user.credits?.length || 0}</td>
                      <td style={tableCell}>
                        <span style={{ color: hasBlockedCard ? '#ff6b6b' : '#88d3ce' }}>
                          {hasBlockedCard ? 'Есть блокировка' : 'Все активны'}
                        </span>
                      </td>
                      <td style={tableCell}>
                        <button 
                          onClick={() => toggleBlock(user.id)}
                          style={styles.smallButton}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.02) translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 25px rgba(110, 69, 226, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1) translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          {hasBlockedCard ? 'Разблокировать все' : 'Заблокировать все'}
                        </button>
                      </td>
                      <td style={tableCell}>
                        <Link to={`/admin/users/${user.id}`} style={styles.detailLink}>Детали</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const tableHeader = {
  textAlign: 'left',
  padding: '12px 8px',
  fontWeight: '600',
  opacity: 0.7,
};

const tableCell = {
  padding: '12px 8px',
};

const styles = {
  smallButton: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  navLink: {
    padding: '10px 20px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  detailLink: {
    color: '#88d3ce',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
};

export default AdminPanel;