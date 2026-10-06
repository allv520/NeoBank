import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../components/Select.css';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: '',
    categoryId: '',
    type: '',
    from: '',
    to: ''
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit,
        offset: page * limit,
        ...filters
      });
      const res = await api.get(`/admin/transactions?${params}`);
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Ошибка загрузки транзакций', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Ошибка загрузки пользователей', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Ошибка загрузки категорий', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const resetFilters = () => {
    setFilters({ userId: '', categoryId: '', type: '', from: '', to: '' });
    setPage(0);
  };

  const totalPages = Math.ceil(total / limit);

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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Все транзакции</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <Link to="/admin" style={styles.backLink}>← Назад в панель</Link>
        </div>

        {/* Фильтры */}
        <div className="bento-item" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
            
            {/* Фильтр по пользователю */}
            <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
              <label style={styles.label}>Пользователь</label>
              <select
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value, page: 0 })}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="">Все</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName || ''} ({u.email})</option>
                ))}
              </select>
            </div>

            {/* Фильтр по категории */}
<div style={{ minWidth: '150px', flex: '1 1 150px' }}>
  <label style={styles.label}>Категория</label>
  <select
    value={filters.categoryId}
    onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 0 })}
    className="custom-select"
    style={{ width: '100%' }}
  >
    <option value="">Все категории</option>
    {categories.map(cat => (
      <option key={cat.id} value={cat.id}>{cat.name} {cat.icon || ''}</option>
    ))}
  </select>
</div>

            {/* Фильтр по типу */}
            <div style={{ minWidth: '120px', flex: '1 1 120px' }}>
              <label style={styles.label}>Тип</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 0 })}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="">Все</option>
                <option value="plus">Доходы</option>
                <option value="minus">Расходы</option>
              </select>
            </div>

            {/* Фильтр по дате "С" */}
            <div style={{ minWidth: '150px', flex: '1 1 150px' }}>
              <label style={styles.label}>С</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value, page: 0 })}
                style={styles.input}
              />
            </div>

            {/* Фильтр по дате "По" */}
            <div style={{ minWidth: '150px', flex: '1 1 150px' }}>
              <label style={styles.label}>По</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value, page: 0 })}
                style={styles.input}
              />
            </div>

            {/* Кнопка сброса */}
            <div style={{ width: '120px' }}>
              <button onClick={resetFilters} style={styles.resetButton}>Сбросить</button>
            </div>
          </div>
        </div>

        {/* Таблица транзакций */}
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
                      <th style={tableHeader}>Карта</th>
                      <th style={tableHeader}>Владелец</th>
                      <th style={tableHeader}>Название</th>
                      <th style={tableHeader}>Сумма</th>
                      <th style={tableHeader}>Тип</th>
                      <th style={tableHeader}>Категория</th>
                      <th style={tableHeader}>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, index) => (
                      <tr
                        key={t.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        }}
                      >
                        <td style={tableCell}>{t.id}</td>
                        <td style={tableCell}>
                          {t.card ? `****${t.card.cardNumber.slice(-4)}` : `ID: ${t.cardId}`}
                        </td>
                        <td style={tableCell}>
                          {t.card?.user ? `${t.card.user.firstName} ${t.card.user.lastName || ''}` : 'Неизвестно'}
                        </td>
                        <td style={tableCell}>{t.name}</td>
                        <td style={{ ...tableCell, color: t.type === 'plus' ? '#88d3ce' : 'white', fontWeight: '600' }}>
                          {t.type === 'plus' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                        </td>
                        <td style={tableCell}>{t.type === 'plus' ? 'Доход' : 'Расход'}</td>
                        <td style={tableCell}>{t.category?.name || 'Без категории'}</td>
                        <td style={tableCell}>{new Date(t.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Пагинация */}
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
                      onClick={() => setPage(p => Math.max(0, p - 1))}
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
                      onClick={() => setPage(p => p + 1)}
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
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
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
};

export default AdminTransactions;