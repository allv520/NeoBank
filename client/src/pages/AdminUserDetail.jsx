import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки данных пользователя');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;
  if (error) return <div style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '100px' }}>{error}</div>;
  if (!user) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Пользователь не найден</div>;

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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Детали пользователя</h1>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/admin" style={styles.backLink}>← Назад к списку</Link>
        </div>

        <div className="bento-item" style={{ padding: '30px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{user.firstName} {user.lastName || ''}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Роль:</strong> {user.role?.name || 'USER'}</p>
            <p><strong>Баланс:</strong> {user.balance.toLocaleString()} ₽</p>
            <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>

          <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Карты</h3>
          <div style={{ marginBottom: '30px' }}>
            {user.cards && user.cards.length > 0 ? (
              user.cards.map(card => (
                <div key={card.id} style={{ 
                  padding: '15px', 
                  marginBottom: '10px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <p><strong>Номер:</strong> ****{card.cardNumber.slice(-4)}</p>
                  <p><strong>Тип:</strong> {card.type?.name || 'VIRTUAL'}</p>
                  <p><strong>Статус:</strong> {card.isBlocked ? '🔴 Заблокирована' : '🟢 Активна'}</p>
                  <p><strong>Лимит:</strong> {card.monthlyLimit.toLocaleString()} ₽</p>
                </div>
              ))
            ) : (
              <p>У пользователя нет карт</p>
            )}
          </div>

          <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>Кредиты</h3>
          <div style={{ marginBottom: '30px' }}>
            {user.credits && user.credits.length > 0 ? (
              user.credits.map(credit => (
                <div key={credit.id} style={{ 
                  padding: '15px', 
                  marginBottom: '10px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <p><strong>Сумма:</strong> {credit.amount.toLocaleString()} ₽</p>
                  <p><strong>Остаток:</strong> {(credit.amount - credit.available).toLocaleString()} ₽</p>
                  <p><strong>Статус:</strong> {credit.status === 'active' ? 'Активен' : credit.status === 'overdue' ? 'Просрочен' : 'Закрыт'}</p>
                </div>
              ))
            ) : (
              <p>У пользователя нет кредитов</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backLink: {
    color: '#88d3ce',
    textDecoration: 'none',
    fontSize: '1rem',
  },
};

export default AdminUserDetail;