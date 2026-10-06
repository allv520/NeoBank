import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../components/Select.css';

const AdminCredits = () => {
  const [credits, setCredits] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ userId: '', status: '' });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit,
        offset: page * limit,
        ...filters
      });
      const res = await api.get(`/admin/credits?${params}`);
      setCredits(res.data.credits);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [page, filters]);

  const resetFilters = () => {
    setFilters({ userId: '', status: '' });
    setPage(0);
  };

  const totalPages = Math.ceil(total / limit);

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Активен';
      case 'overdue': return 'Просрочен';
      case 'closed': return 'Закрыт';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#88d3ce';
      case 'overdue': return '#ff6b6b';
      case 'closed': return 'gray';
      default: return 'white';
    }
  };

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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Кредиты пользователей</h1>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/admin" style={styles.backLink}>← Назад в панель</Link>
        </div>

        <div className="bento-item" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
            
            <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
              <label style={styles.label}>Пользователь</label>
              <select 
                value={filters.userId} 
                onChange={(e) => setFilters({...filters, userId: e.target.value, page: 0})}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="">Все</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: '150px', flex: '1 1 150px' }}>
              <label style={styles.label}>Статус</label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value, page: 0})}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="">Все</option>
                <option value="active">Активен</option>
                <option value="overdue">Просрочен</option>
                <option value="closed">Закрыт</option>
              </select>
            </div>

            <div style={{ width: '120px' }}>
              <button onClick={resetFilters} style={styles.resetButton}>Сбросить</button>
            </div>
          </div>
        </div>

        <div className="bento-item" style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                      <th style={tableHeader}>ID</th>
                      <th style={tableHeader}>Пользователь</th>
                      <th style={tableHeader}>Сумма</th>
                      <th style={tableHeader}>Задолженность</th>
                      <th style={tableHeader}>Доступно</th>
                      <th style={tableHeader}>Платёж</th>
                      <th style={tableHeader}>Срок</th>
                      <th style={tableHeader}>Статус</th>
                      <th style={tableHeader}>Дата выдачи</th>
                      <th style={tableHeader}>Детали</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credits.map((credit, index) => {
                      // Вычисление задолженности (amount - available)
                      const debt = (credit.amount || 0) - (credit.available || 0);
                      return (
                        <tr 
                          key={credit.id} 
                          style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          }}
                        >
                          <td style={tableCell}>{credit.id}</td>
                          <td style={tableCell}>
                            {credit.user ? `${credit.user.firstName} ${credit.user.lastName || ''}` : `ID: ${credit.userId}`}
                          </td>
                          <td style={tableCell}>{credit.amount?.toLocaleString() || 0} ₽</td>
                          <td style={tableCell}>{debt.toLocaleString()} ₽</td>
                          <td style={tableCell}>{credit.available?.toLocaleString() || 0} ₽</td>
                          <td style={tableCell}>{credit.monthlyPayment?.toFixed(2) || 0} ₽</td>
                          <td style={tableCell}>{credit.termMonths || 0} мес</td>
                          <td style={{ ...tableCell, color: getStatusColor(credit.status) }}>
                            {getStatusText(credit.status)}
                          </td>
                          <td style={tableCell}>{credit.issuedAt ? new Date(credit.issuedAt).toLocaleDateString() : ''}</td>
                          <td style={tableCell}>
                            <Link to={`/admin/credits/${credit.id}`} style={styles.detailLink}>Подробнее</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '30px',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ opacity: 0.7 }}>
                    Показано {page * limit + 1} - {Math.min((page + 1) * limit, total)} из {total}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => setPage(p => Math.max(0, p-1))} 
                      disabled={page === 0}
                      style={{
                        ...styles.pageButton,
                        opacity: page === 0 ? 0.5 : 1,
                        cursor: page === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ← Назад
                    </button>
                    <span style={{ 
                      padding: '8px 16px', 
                      background: 'rgba(110,69,226,0.2)', 
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}>
                      {page + 1} / {totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(p => p+1)} 
                      disabled={(page + 1) * limit >= total}
                      style={{
                        ...styles.pageButton,
                        opacity: (page + 1) * limit >= total ? 0.5 : 1,
                        cursor: (page + 1) * limit >= total ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Вперёд →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const tableHeader = {
  textAlign: 'left',
  padding: '12px 8px',
  fontWeight: '600',
  opacity: 0.8,
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
};

const tableCell = {
  padding: '12px 8px',
  fontSize: '0.9rem',
};

const styles = {
  label: {
    display: 'block',
    fontSize: '0.85rem',
    opacity: 0.7,
    marginBottom: '4px',
    color: 'white',
  },
  resetButton: {
    width: '100%',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: '0.2s',
    height: '38px',
    whiteSpace: 'nowrap',
  },
  pageButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.2s',
    minWidth: '80px',
  },
  backLink: {
    color: '#88d3ce',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: '0.2s',
  },
  detailLink: {
    color: '#88d3ce',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
};

export default AdminCredits;