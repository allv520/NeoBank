import React from 'react';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
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
      zIndex: 2000,
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        background: '#111112',
        padding: '40px',
        borderRadius: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: '400px',
        width: '90%',
        color: 'white',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          marginBottom: '15px',
          fontWeight: '600',
          margin: '0 0 15px 0',
        }}>{title || 'Подтверждение'}</h3>
        <p style={{
          fontSize: '1rem',
          opacity: 0.7,
          marginBottom: '30px',
        }}>{message || 'Вы уверены?'}</p>
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
        }}>
          <button 
            onClick={onConfirm} 
            style={{
              padding: '12px 30px',
              borderRadius: '30px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
              color: 'white',
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
            Да
          </button>
          <button 
            onClick={onCancel} 
            style={{
              padding: '12px 30px',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02) translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px rgba(110, 69, 226, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;