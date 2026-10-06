import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get('/cards');
        setCards(res.data);
        if (res.data.length > 0) {
          setSelectedCardId(res.data[0].id);
          setMonthlyLimit(res.data[0].monthlyLimit);
          setIsBlocked(res.data[0].isBlocked);
        }
      } catch (error) {
        console.error('Ошибка загрузки карт', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [navigate]);

  const handleCardChange = (cardId) => {
    const card = cards.find(c => c.id === parseInt(cardId));
    if (card) {
      setSelectedCardId(card.id);
      setMonthlyLimit(card.monthlyLimit);
      setIsBlocked(card.isBlocked);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      await api.patch(`/cards/${selectedCardId}/settings`, {
        monthlyLimit: parseFloat(monthlyLimit),
        isBlocked,
      });
      setMessage({ text: 'Настройки карты сохранены!', type: 'success' });
      // Обновление списка карт в состоянии
      const updatedCards = cards.map(card =>
        card.id === selectedCardId ? { ...card, monthlyLimit: parseFloat(monthlyLimit), isBlocked } : card
      );
      setCards(updatedCards);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Ошибка при сохранении', type: 'error' });
    } finally {
      setSaving(false);
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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', fontWeight: '800' }}>Настройки</h1>
        <div className="bento-item" style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Выберите карту</label>
              <select
                value={selectedCardId}
                onChange={(e) => handleCardChange(e.target.value)}
                style={styles.select}
              >
                {cards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.cardNumber} ({card.type?.name || 'VIRTUAL'}) - {card.isBlocked ? '🔒 Заблокирована' : '🔓 Активна'}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Месячный лимит на покупки (₽)</label>
              <input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                min="0"
                step="1000"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isBlocked}
                  onChange={(e) => setIsBlocked(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={{ marginLeft: '10px' }}>Заблокировать карту</span>
              </label>
            </div>
            {message.text && (
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: message.type === 'success' ? 'rgba(136, 211, 206, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                color: message.type === 'success' ? '#88d3ce' : '#ff6b6b',
                textAlign: 'center'
              }}>
                {message.text}
              </div>
            )}
            <div style={styles.buttonGroup}>
              <button type="submit" disabled={saving} style={{ ...styles.button, ...styles.save }}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} style={{ ...styles.button, ...styles.cancel }}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '1rem', opacity: 0.7, color: 'white' },
  input: { padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '1rem', outline: 'none' },
  select: { padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '1rem' },
  checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1rem' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6e45e2' },
  buttonGroup: { display: 'flex', gap: '15px', marginTop: '20px' },
  button: { flex: 1, padding: '16px', borderRadius: '14px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' },
  save: { background: 'linear-gradient(135deg, #6e45e2, #88d3ce)', color: 'white' },
  cancel: { background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }
};

export default Settings;