import React, { useState, useEffect } from 'react';
import api from '../api';

const TransferForm = ({ onSuccess, onCancel, cards }) => {
  const [form, setForm] = useState({
    fromCardId: cards[0]?.id || '',
    toCardNumber: '',
    amount: '',
    name: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Ошибка загрузки категорий', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/transfer', {
        fromCardId: parseInt(form.fromCardId),
        toCardNumber: form.toCardNumber.replace(/\s/g, ''),
        amount: amountNum,
        name: form.name || undefined,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка перевода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {cards.length > 0 && (
        <div style={styles.inputGroup}>
          <label style={styles.label}>Карта отправителя</label>
          <select
            value={form.fromCardId}
            onChange={(e) => setForm({...form, fromCardId: e.target.value})}
            style={styles.select}
            required
          >
            <option value="">Выберите карту</option>
            {cards.map(card => (
              <option key={card.id} value={card.id}>
                {card.cardNumber} ({card.type?.name || 'VIRTUAL'})
              </option>
            ))}
          </select>
        </div>
      )}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Номер карты получателя</label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={form.toCardNumber}
          onChange={(e) => setForm({...form, toCardNumber: e.target.value.replace(/\D/g, '')})}
          required
          style={styles.input}
          maxLength="16"
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Сумма (₽)</label>
        <input
          type="text"
          placeholder="1000"
          value={form.amount}
          onChange={(e) => setForm({...form, amount: e.target.value.replace(/[^\d]/g, '')})}
          required
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Назначение (необязательно)</label>
        <input
          type="text"
          placeholder="Подарок"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Категория (необязательно)</label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({...form, categoryId: e.target.value})}
          style={styles.select}
        >
          <option value="">Без категории</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.buttonGroup}>
        <button type="submit" disabled={loading} style={{...styles.button, ...styles.submit}}>
          {loading ? 'Отправка...' : 'Перевести'}
        </button>
        <button type="button" onClick={onCancel} style={{...styles.button, ...styles.cancel}}>
          Отмена
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9rem',
    opacity: 0.7,
    color: 'white',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  select: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  button: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  submit: {
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    color: 'white',
  },
  cancel: {
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    textAlign: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: '8px',
    borderRadius: '8px',
  },
};

export default TransferForm;