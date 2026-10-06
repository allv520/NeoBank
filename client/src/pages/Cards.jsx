import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CardComponent from '../components/Card';
import ReissueCardModal from '../components/ReissueCardModal';

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showReissueModal, setShowReissueModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const navigate = useNavigate();

  const fetchCards = async () => {
    try {
      const res = await api.get('/cards');
      setCards(res.data);
    } catch (error) {
      console.error('Ошибка загрузки карт', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openReissueModal = (cardId) => {
    setSelectedCardId(cardId);
    setShowReissueModal(true);
  };

  const handleReissue = async () => {
    if (!selectedCardId) return;
    setShowReissueModal(false);
    try {
      const res = await api.post(`/cards/${selectedCardId}/reissue`);
      setCards(prev => prev.map(card => card.id === selectedCardId ? res.data : card));
      setMessage({ text: 'Карта успешно перевыпущена!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Ошибка при перевыпуске карты', type: 'error' });
    } finally {
      setSelectedCardId(null);
    }
  };

  const handleNewCard = async () => {
    try {
      const res = await api.post('/reissue-card'); // создаёт новую карту
      setCards(prev => [...prev, res.data]);
      setMessage({ text: 'Новая карта выпущена!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Ошибка при выпуске карты', type: 'error' });
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', fontWeight: '800' }}>Мои карты</h1>
        
        {message.text && (
          <div style={{ 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? 'rgba(136, 211, 206, 0.1)' : 'rgba(255, 107, 107, 0.1)',
            color: message.type === 'success' ? '#88d3ce' : '#ff6b6b',
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        {cards.map(card => (
          <div key={card.id} className="bento-item" style={{ marginBottom: '20px', padding: '30px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <CardComponent 
                userName={card.user?.firstName || 'Владелец'} 
                cardNumber={card.cardNumber} 
                expiry={card.expiry} 
              />
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span>Тип: {card.type?.name || 'VIRTUAL'}</span>
              <span>Статус: {card.isBlocked ? '🔴 Заблокирована' : '🟢 Активна'}</span>
              <span>Лимит: {card.monthlyLimit.toLocaleString()} ₽</span>
              <button 
                onClick={() => openReissueModal(card.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02) translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(110, 69, 226, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Перевыпустить
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={handleNewCard}
            style={{
              padding: '14px 30px',
              borderRadius: '30px',
              border: 'none',
              background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
              color: 'white',
              fontSize: '1rem',
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
            Выпустить новую карту
          </button>
        </div>
      </div>

      <ReissueCardModal
        isOpen={showReissueModal}
        onConfirm={handleReissue}
        onCancel={() => {
          setShowReissueModal(false);
          setSelectedCardId(null);
        }}
      />
    </div>
  );
};

export default Cards;