import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const AdminCreditDetail = () => {
  const { id } = useParams();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const res = await api.get(`/admin/credits/${id}`);
        setCredit(res.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки кредита');
      } finally {
        setLoading(false);
      }
    };
    fetchCredit();
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;
  if (error) return <div style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '100px' }}>{error}</div>;
  if (!credit) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Кредит не найден</div>;

  const debt = credit.amount - credit.available;

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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Детали кредита</h1>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/admin/credits" style={styles.backLink}>← Назад к списку</Link>
        </div>

        <div className="bento-item" style={{ padding: '30px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Кредит #{credit.id}</h3>
            <p><strong>Пользователь:</strong> {credit.user?.firstName} {credit.user?.lastName} ({credit.user?.email})</p>
            <p><strong>Сумма кредита:</strong> {credit.amount.toLocaleString()} ₽</p>
            <p><strong>Задолженность:</strong> {debt.toLocaleString()} ₽</p>
            <p><strong>Доступно для снятия:</strong> {credit.available.toLocaleString()} ₽</p>
            <p><strong>Ежемесячный платёж:</strong> {credit.monthlyPayment.toFixed(2)} ₽</p>
            <p><strong>Срок:</strong> {credit.termMonths} мес.</p>
            <p><strong>Процентная ставка:</strong> {credit.interestRate}%</p>
            <p><strong>Дата выдачи:</strong> {new Date(credit.issuedAt).toLocaleString()}</p>
            <p><strong>Дата следующего платежа:</strong> {new Date(credit.nextPaymentDate).toLocaleString()}</p>
            <p><strong>Статус:</strong> 
              <span style={{ 
                color: getStatusColor(credit.status),
                marginLeft: '10px',
                fontWeight: '600'
              }}>
                {getStatusText(credit.status)}
              </span>
            </p>
            {credit.penalty > 0 && (
              <p><strong>Пеня:</strong> <span style={{ color: '#ff6b6b' }}>{credit.penalty.toFixed(2)} ₽</span></p>
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

export default AdminCreditDetail;