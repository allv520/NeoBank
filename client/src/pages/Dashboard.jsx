import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from '../components/Card';
import api from '../api';
import TransferForm from '../components/TransferForm';
import DepositForm from '../components/DepositForm';
import '../components/Select.css';
import { NavLink, useNavigate } from 'react-router-dom';

const COLORS = [
  '#6e45e2', '#88d3ce', '#a281f6', '#4aa3a0', '#b794f4',
  '#f6a5c0', '#f9b17a', '#7c4dff', '#ff6b6b', '#4ecdc4',
  '#ffe66d', '#ff9f4a', '#b8e1fc', '#c77dff', '#ffb3ba'
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null); // для пополнения/перевода

  const fetchData = async () => {
    try {
      const [userRes, creditRes] = await Promise.all([
        api.get('/me'),
        api.get('/credit')
      ]);
      setUserData({ ...userRes.data, credit: creditRes.data });
      
      // все транзакции из всех карт
      const allTransactions = userRes.data.cards?.flatMap(card => card.transactions || []) || [];
      setTransactions(allTransactions);

      const analyticsRes = await api.get(`/user/${userRes.data.id}/analytics/categories`);
      setCategoryData(analyticsRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransferSuccess = () => {
    setShowTransfer(false);
    fetchData();
  };

  const handleDepositSuccess = () => {
    setShowDeposit(false);
    fetchData();
  };

  const handleDepositClick = () => {
    if (userData.cards && userData.cards.length > 0) {
      setSelectedCard(userData.cards[0]); // по умолчанию выбираем первую карту
      setShowDeposit(true);
    } else {
      alert('У вас нет карт для пополнения');
    }
  };

  const handleTransferClick = () => {
    if (userData.cards && userData.cards.length > 0) {
      setSelectedCard(userData.cards[0]); // по умолчанию выбираем первую карту
      setShowTransfer(true);
    } else {
      alert('У вас нет карт для перевода');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (categoryFilter !== 'all' && t.category?.name !== categoryFilter) return false;
    if (dateFilter !== 'all') {
      const now = new Date();
      const txDate = new Date(t.date);
      const diffDays = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
      if (dateFilter === 'today' && diffDays > 0) return false;
      if (dateFilter === 'week' && diffDays > 7) return false;
      if (dateFilter === 'month' && diffDays > 30) return false;
    }
    return true;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, t) => {
    const date = new Date(t.date).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {});

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;
  }

  if (!userData) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Ошибка загрузки данных</div>;
  }

  // Основную карту для отображения (первую)
  const mainCard = userData.cards && userData.cards.length > 0 ? userData.cards[0] : null;

  return (
    <div className="page-fade-in" style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#0a0a0b', 
      color: 'white', 
      paddingTop: '80px',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      
      <aside style={{ 
        width: '260px', 
        borderRight: '1px solid rgba(255,255,255,0.05)', 
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <NavLink to="/dashboard" style={({ isActive }) => ({ textDecoration: 'none', padding: '14px 20px', borderRadius: '15px', transition: '0.3s', color: isActive ? '#88d3ce' : 'rgba(255,255,255,0.4)', fontWeight: isActive ? '700' : '500', display: 'block', background: isActive ? 'rgba(110, 69, 226, 0.1)' : 'transparent' })}>Обзор</NavLink>
        <NavLink to="/cards" style={({ isActive }) => ({ textDecoration: 'none', padding: '14px 20px', borderRadius: '15px', transition: '0.3s', color: isActive ? '#88d3ce' : 'rgba(255,255,255,0.4)', fontWeight: isActive ? '700' : '500', display: 'block', background: isActive ? 'rgba(110, 69, 226, 0.1)' : 'transparent' })}>Карты</NavLink>
        <NavLink to="/transactions" style={({ isActive }) => ({ textDecoration: 'none', padding: '14px 20px', borderRadius: '15px', transition: '0.3s', color: isActive ? '#88d3ce' : 'rgba(255,255,255,0.4)', fontWeight: isActive ? '700' : '500', display: 'block', background: isActive ? 'rgba(110, 69, 226, 0.1)' : 'transparent' })}>Транзакции</NavLink>
        <NavLink to="/credit" style={({ isActive }) => ({ textDecoration: 'none', padding: '14px 20px', borderRadius: '15px', transition: '0.3s', color: isActive ? '#88d3ce' : 'rgba(255,255,255,0.4)', fontWeight: isActive ? '700' : '500', display: 'block', background: isActive ? 'rgba(110, 69, 226, 0.1)' : 'transparent' })}>Кредиты</NavLink>
        <NavLink to="/settings" style={({ isActive }) => ({ textDecoration: 'none', padding: '14px 20px', borderRadius: '15px', transition: '0.3s', color: isActive ? '#88d3ce' : 'rgba(255,255,255,0.4)', fontWeight: isActive ? '700' : '500', display: 'block', background: isActive ? 'rgba(110, 69, 226, 0.1)' : 'transparent' })}>Настройки</NavLink>
      </aside>

      <main style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Личный кабинет</h1>
            <p style={{ opacity: 0.4, marginTop: '5px' }}>Рады видеть вас, {userData.firstName}!</p>
          </div>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(45deg, #6e45e2, #88d3ce)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{userData.firstName[0]}</div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '30px' }}>
          
          {/* Секция с картой */}
          <div style={{ gridColumn: 'span 5' }}>
            <div 
              style={{ transition: 'all 0.5s cubic-bezier(0.2, 1, 0.3, 1)', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(-5deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)'}
            >
              {mainCard ? (
                <Card 
                  userName={`${userData.firstName} ${userData.lastName || ''}`.toUpperCase()} 
                  cardNumber={mainCard.cardNumber} 
                  expiry={mainCard.expiry} 
                />
              ) : (
                <Card 
                  userName="CARD HOLDER" 
                  cardNumber="0000 0000 0000 0000" 
                  expiry="00/00" 
                />
              )}
            </div>
            <div style={{ 
              marginTop: '25px', padding: '20px', borderRadius: '20px', 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>Лимит на покупки</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', marginTop: '4px' }}>
                  {mainCard ? mainCard.monthlyLimit.toLocaleString() : '0'} ₽ / мес
                </div>
              </div>
              <div style={{ color: mainCard?.isBlocked ? '#ff6b6b' : '#88d3ce', fontSize: '0.85rem', fontWeight: '700' }}>
                {mainCard?.isBlocked ? '• ЗАБЛОКИРОВАНА' : '• АКТИВНА'}
              </div>
            </div>
          </div>

          {/* Баланс */}
          <div style={{ gridColumn: 'span 7' }}>
            <div className="bento-item" style={{ padding: '35px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ opacity: 0.4, fontSize: '0.9rem', marginBottom: '10px' }}>Доступный остаток</p>
              <h2 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>
                {userData.balance?.toLocaleString()} <span style={{ color: '#88d3ce' }}>₽</span>
              </h2>
              <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                {!mainCard?.isBlocked ? (
                  <button 
                    className="main-button" 
                    style={{ padding: '16px 35px', borderRadius: '15px', border: 'none', background: 'linear-gradient(135deg, #6e45e2, #88d3ce)', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onClick={handleDepositClick}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02) translateY(-2px)';
                      e.target.style.boxShadow = '0 20px 45px rgba(110, 69, 226, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1) translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Пополнить
                  </button>
                ) : (
                  <button 
                    className="main-button" 
                    style={{ 
                      padding: '16px 35px', 
                      borderRadius: '15px', 
                      backgroundColor: '#555', 
                      background: '#555', 
                      cursor: 'not-allowed',
                      opacity: 0.6,
                      border: 'none'
                    }}
                    disabled
                    title="Карта заблокирована, пополнение невозможно"
                  >
                    Карта заблокирована
                  </button>
                )}
                <button 
                  style={{ 
                    padding: '16px 35px', borderRadius: '15px', 
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'white', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease'
                  }}
                  onClick={handleTransferClick}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02) translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(110, 69, 226, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Перевести
                </button>
              </div>
            </div>
          </div>

          {!userData.credit && (
            <div className="bento-item" style={{ gridColumn: 'span 5', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>Нужны деньги?</h3>
              <p style={{ opacity: 0.7, textAlign: 'center', marginBottom: '20px' }}>
                Оформите кредит до 100 000 ₽ прямо сейчас!
              </p>
              <button 
                onClick={() => navigate('/credit')}
                style={{
                  padding: '12px 30px',
                  borderRadius: '30px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02) translateY(-2px)';
                  e.target.style.boxShadow = '0 20px 45px rgba(110, 69, 226, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Подробнее
              </button>
            </div>
          )}

          {/* График расходов */}
          <div className="bento-item" style={{ gridColumn: 'span 7', padding: '30px', height: '380px' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '1.2rem' }}>Аналитика трат (ежедневно)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={transactions.filter(t => t.type === 'minus').map(t => ({ day: new Date(t.date).toLocaleDateString(), value: t.amount })).slice(0, 7)}>
                <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6e45e2" stopOpacity={0.4}/><stop offset="95%" stopColor="#6e45e2" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} dy={10} />
                <Tooltip contentStyle={{ background: '#111112', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="value" stroke="#6e45e2" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

{/* Круговая диаграмма по категориям */}
<div className="bento-item" style={{ gridColumn: 'span 5', padding: '30px', display: 'flex', flexDirection: 'column', minHeight: '450px' }}>
  <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Расходы по категориям</h3>
  
  {categoryData.length > 0 ? (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column',  
      flex: 1,
      minHeight: '350px'
    }}>
      <PieChart width={350} height={280}>  
        <Pie 
          data={categoryData} 
          cx="50%" 
          cy="50%" 
          labelLine={false}
          label={false}
          outerRadius={100}   
          fill="#8884d8" 
          dataKey="total" 
          nameKey="category"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            background: '#1a1a1a', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px', 
            color: 'white', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)' 
          }} 
          itemStyle={{ color: 'white' }} 
          labelStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }} 
          formatter={(value) => `${value.toLocaleString()} ₽`}
        />
      </PieChart>
      <Legend 
        wrapperStyle={{ 
          paddingTop: '15px', 
          fontSize: '11px', 
          color: 'white', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: '8px',
          maxWidth: '100%'   
        }} 
        formatter={(value) => <span style={{ color: 'white', marginRight: '8px' }}>{value}</span>}
      />
    </div>
  ) : (
    <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '40px' }}>Нет данных о расходах</p>
  )}
</div>

          {/* История операций */}
          <div className="bento-item" style={{ gridColumn: 'span 7', padding: '30px', display: 'flex', flexDirection: 'column', maxHeight: '500px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>История операций</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter} className="custom-select">
                  <option value="all">Все время</option>
                  <option value="today">Сегодня</option>
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                </select>
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter} className="custom-select">
                  <option value="all">Все категории</option>
                  {Array.from(new Set(transactions.map(t => t.category?.name).filter(Boolean))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
              {Object.keys(groupedTransactions).length > 0 ? (
                Object.entries(groupedTransactions).map(([date, txs]) => (
                  <div key={date}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '10px', marginTop: '20px', fontWeight: '600', letterSpacing: '1px' }}>{date}</div>
                    {txs.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.icon}</div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1rem' }}>{t.name}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.4 }}>{t.category?.name || 'Без категории'}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '1rem', color: t.type === 'plus' ? '#88d3ce' : 'white' }}>
                          {t.type === 'plus' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '40px' }}>Нет операций за выбранный период</p>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Модальные окна */}
      {showTransfer && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <h3 style={{ marginBottom: '20px', color: 'white' }}>Перевод средств</h3>
            <TransferForm 
              cards={userData.cards} 
              onSuccess={handleTransferSuccess} 
              onCancel={() => setShowTransfer(false)} 
            />
          </div>
        </div>
      )}

      {showDeposit && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <h3 style={{ marginBottom: '20px', color: 'white' }}>Пополнение счета</h3>
            <DepositForm 
              cardId={selectedCard?.id} 
              onSuccess={handleDepositSuccess} 
              onCancel={() => setShowDeposit(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    background: '#111112',
    padding: '40px',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: '400px',
    width: '100%',
    color: 'white',
  },
};

export default Dashboard;