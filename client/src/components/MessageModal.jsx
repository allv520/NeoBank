import React from 'react';

const MessageModal = ({ isOpen, onClose, title, message }) => {
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
        }}>{title || 'Уведомление'}</h3>
        <p style={{
          fontSize: '1rem',
          opacity: 0.7,
          marginBottom: '30px',
        }}>{message}</p>
        <button 
          onClick={onClose} 
          style={{
            padding: '12px 40px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: '0.3s',
            background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
            color: 'white',
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MessageModal;