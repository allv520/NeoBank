import React, { useState } from 'react';
import api from '../api';

const DepositForm = ({ onSuccess, onCancel, cardId }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/deposit', { cardId, amount: num });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка пополнения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Сумма пополнения (₽)</label>
        <input
          type="number"
          placeholder="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          style={styles.input}
        />
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.buttonGroup}>
        <button type="submit" disabled={loading} style={{...styles.button, ...styles.submit}}>
          {loading ? 'Пополнение...' : 'Пополнить'}
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

export default DepositForm;