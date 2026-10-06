import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../components/Select.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    customStart: '',
    customEnd: '',
    category: 'all',
    type: 'all',
    search: '',
  });
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.get('/me');
      // Все транзакции из всех карт
      const allTransactions = res.data.cards?.flatMap(card => card.transactions || []) || [];
      setTransactions(allTransactions);
      // Уникальные имена категорий
      const cats = [...new Set(allTransactions.map(t => t.category?.name).filter(Boolean))];
      setCategories(cats);
    } catch (error) {
      console.error('Ошибка загрузки транзакций', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category?.name === filters.category);
    }

    const now = new Date();
    if (filters.dateRange === 'today') {
      filtered = filtered.filter(t => new Date(t.date).toDateString() === now.toDateString());
    } else if (filters.dateRange === 'week') {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (filters.dateRange === 'month') {
      const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
    } else if (filters.dateRange === 'custom' && filters.customStart && filters.customEnd) {
      const start = new Date(filters.customStart);
      const end = new Date(filters.customEnd); end.setHours(23,59,59,999);
      filtered = filtered.filter(t => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
    }

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchLower));
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setFilters({
      dateRange: 'all',
      customStart: '',
      customEnd: '',
      category: 'all',
      type: 'all',
      search: '',
    });
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;
  }

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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', fontWeight: '800' }}>История операций</h1>

        <div className="bento-item" style={{ padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            <div>
              <label style={styles.label}>Период</label>
              <select 
                value={filters.dateRange} 
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="all">Все время</option>
                <option value="today">Сегодня</option>
                <option value="week">Последние 7 дней</option>
                <option value="month">Последние 30 дней</option>
                <option value="custom">Произвольный</option>
              </select>
            </div>

            {filters.dateRange === 'custom' && (
              <>
                <div>
                  <label style={styles.label}>С</label>
                  <input 
                    type="date" 
                    value={filters.customStart} 
                    onChange={(e) => setFilters({...filters, customStart: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>По</label>
                  <input 
                    type="date" 
                    value={filters.customEnd} 
                    onChange={(e) => setFilters({...filters, customEnd: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </>
            )}

            <div>
              <label style={styles.label}>Категория</label>
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="all">Все категории</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Тип</label>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="custom-select"
                style={{ width: '100%' }}
              >
                <option value="all">Все</option>
                <option value="plus">Доходы</option>
                <option value="minus">Расходы</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Поиск</label>
              <input 
                type="text" 
                placeholder="Название операции..." 
                value={filters.search} 
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={resetFilters} style={styles.resetButton}>
                Сбросить
              </button>
            </div>
          </div>
        </div>

        <div className="bento-item" style={{ padding: '30px' }}>
          {filteredTransactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredTransactions.map(t => (
                <div key={t.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '15px 20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  transition: '0.3s',
                }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '14px', 
                      background: 'rgba(255,255,255,0.05)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1.5rem' 
                    }}>
                      {t.icon || '💳'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{t.name}</div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '4px', fontSize: '0.85rem', opacity: 0.6 }}>
                        <span>{t.category?.name || 'Без категории'}</span>
                        <span>{new Date(t.date).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '800', 
                    fontSize: '1.2rem',
                    color: t.type === 'plus' ? '#88d3ce' : 'white'
                  }}>
                    {t.type === 'plus' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.5, textAlign: 'center', padding: '40px' }}>
              Нет операций, соответствующих фильтрам
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontSize: '0.85rem',
    opacity: 0.7,
    marginBottom: '6px',
    color: 'white',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  resetButton: {
    padding: '10px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: 'white',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: '0.3s',
    width: '100%',
    height: '42px',
  },
};

export default Transactions;