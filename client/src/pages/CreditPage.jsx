import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreditPage = () => {
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: '', termMonths: '' });
  const [repayAmount, setRepayAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const [interestRate, setInterestRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);

  const navigate = useNavigate();

  const fetchCredit = async () => {
    try {
      const res = await api.get('/credit');
      setCredit(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredit();
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      setLoadingRate(true);
      try {
        const res = await api.get('/credit/rate');
        setInterestRate(res.data.rate);
      } catch (err) {
        console.error('Ошибка загрузки ставки, используется 12%', err);
        setInterestRate(12);
      } finally {
        setLoadingRate(false);
      }
    };
    fetchRate();
  }, []);

  useEffect(() => {
    if (form.amount && form.termMonths && interestRate) {
      const amount = parseFloat(form.amount);
      const months = parseInt(form.termMonths);
      if (amount > 0 && months > 0) {
        const monthlyRate = interestRate / 100 / 12;
        const factor = Math.pow(1 + monthlyRate, months);
        const monthlyPayment = amount * monthlyRate * factor / (factor - 1);
        const totalRepayment = monthlyPayment * months;
        const overpayment = totalRepayment - amount;
        setPreview({
          monthlyPayment: monthlyPayment.toFixed(2),
          totalRepayment: totalRepayment.toFixed(2),
          overpayment: overpayment.toFixed(2)
        });
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [form, interestRate]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/credit/apply', {
        amount: parseFloat(form.amount),
        termMonths: parseInt(form.termMonths)
      });
      await fetchCredit();
      setForm({ amount: '', termMonths: '' });
      setSuccess('Кредит оформлен!');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка оформления');
    }
  };

  const handleRepay = async () => {
    const num = parseFloat(repayAmount);
    if (isNaN(num) || num <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.post('/credit/repay', { amount: num });
      await fetchCredit();
      setRepayAmount('');
      setSuccess('Платёж выполнен!');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка погашения');
    }
  };

  const handleWithdraw = async () => {
    const num = parseFloat(withdrawAmount);
    if (isNaN(num) || num <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    if (!credit) return;
    if (num > credit.available) {
      setError('Сумма превышает доступный остаток кредита');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.post('/credit/withdraw', { amount: num });
      await fetchCredit();
      setWithdrawAmount('');
      setSuccess('Средства переведены на карту!');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка вывода');
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;

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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', fontWeight: '800' }}>Кредиты</h1>

        {loadingRate && <p style={{ color: '#88d3ce', marginBottom: '10px' }}>Загружаем вашу персональную ставку...</p>}
        {!loadingRate && interestRate && (
          <p style={{ color: '#88d3ce', marginBottom: '20px', fontSize: '1.2rem' }}>
            Ваша персональная процентная ставка: <strong>{interestRate}%</strong>
          </p>
        )}

        {credit ? (
          <>
            <div className="bento-item" style={{ padding: '30px', marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Ваш кредит</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div><p style={styles.statLabel}>Лимит</p><p style={styles.statValue}>{credit.amount.toLocaleString()} ₽</p></div>
                <div><p style={styles.statLabel}>Задолженность</p><p style={{ ...styles.statValue, color: '#ff6b6b' }}>{credit.debt.toLocaleString()} ₽</p></div>
                <div><p style={styles.statLabel}>Доступно для снятия</p><p style={{ ...styles.statValue, color: '#88d3ce' }}>{credit.available.toLocaleString()} ₽</p></div>
                <div><p style={styles.statLabel}>Ежемесячный платёж</p><p style={styles.statValue}>{credit.monthlyPayment.toFixed(2)} ₽</p></div>
                <div><p style={styles.statLabel}>Срок</p><p style={styles.statValue}>{credit.termMonths} мес.</p></div>
                <div><p style={styles.statLabel}>Ставка</p><p style={styles.statValue}>{credit.interestRate}%</p></div>
                <div><p style={styles.statLabel}>Следующий платёж</p><p style={styles.statValue}>{new Date(credit.nextPaymentDate).toLocaleDateString()}</p></div>
                <div><p style={styles.statLabel}>Статус</p><p style={{ ...styles.statValue, color: credit.status === 'active' ? '#88d3ce' : credit.status === 'overdue' ? '#ff6b6b' : 'gray' }}>
                  {credit.status === 'active' ? 'Активен' : credit.status === 'overdue' ? 'Просрочен' : 'Закрыт'}
                </p></div>
                {credit.penalty > 0 && (
                  <div><p style={styles.statLabel}>Пеня</p><p style={{ ...styles.statValue, color: '#ff6b6b' }}>{credit.penalty.toFixed(2)} ₽</p></div>
                )}
              </div>
            </div>

            <div className="bento-item" style={{ padding: '30px', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Снять деньги с кредита</h3>
              <p style={{ opacity: 0.7, marginBottom: '15px' }}>Вы можете получить до {credit.available.toLocaleString()} ₽ на свою карту.</p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input type="number" placeholder="Сумма" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} style={styles.input} />
                <button onClick={handleWithdraw} style={styles.button}>Перевести на карту</button>
              </div>
            </div>

            <div className="bento-item" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Погасить кредит</h3>
              <p style={{ opacity: 0.7, marginBottom: '15px' }}>Сумма к погашению: {(credit.debt + credit.penalty).toFixed(2)} ₽</p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input type="number" placeholder="Сумма" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} style={styles.input} />
                <button onClick={handleRepay} style={styles.button}>Погасить</button>
              </div>
              {error && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}
            </div>
          </>
        ) : (
          <div className="bento-item" style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Оформить кредит</h2>
            <p style={{ marginBottom: '20px', opacity: 0.7 }}>
              Выберите сумму и срок кредита. Процентная ставка — <strong>{interestRate ? interestRate + '%' : 'индивидуальная'}</strong>.
            </p>
            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={styles.label}>Сумма (₽)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} min="1000" max="100000" step="1000" required style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Срок (месяцев)</label>
                <input type="number" value={form.termMonths} onChange={(e) => setForm({ ...form, termMonths: e.target.value })} min="1" max="60" required style={styles.input} />
              </div>
              {preview && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginTop: '10px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Предварительный расчёт</h4>
                  <p>Ежемесячный платёж: <strong>{preview.monthlyPayment} ₽</strong></p>
                  <p>Общая сумма выплат: <strong>{preview.totalRepayment} ₽</strong></p>
                  <p>Переплата: <strong style={{ color: '#ff6b6b' }}>{preview.overpayment} ₽</strong></p>
                </div>
              )}
              {error && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}
              <button type="submit" style={styles.button}>Оформить кредит</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontSize: '0.9rem',
    opacity: 0.7,
    marginBottom: '8px',
    color: 'white',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.02)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: '0.2s',
    minWidth: '200px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '30px',
    border: 'none',
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
  success: {
    color: '#88d3ce',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
  statLabel: {
    fontSize: '0.8rem',
    opacity: 0.5,
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },
};

export default CreditPage;