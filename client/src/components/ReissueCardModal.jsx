import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReissueCardModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={styles.overlay}>
        <motion.div 
          style={styles.modal}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h3 style={styles.title}>Перевыпуск карты</h3>
          <p style={styles.message}>
            Вы уверены, что хотите перевыпустить карту? Старый номер будет утерян.
          </p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={onConfirm} 
              style={{...styles.button, ...styles.confirm}}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02) translateY(-2px)';
                e.target.style.boxShadow = '0 20px 45px rgba(110, 69, 226, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Да, перевыпустить
            </button>
            <button 
              onClick={onCancel} 
              style={{...styles.button, ...styles.cancel}}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02) translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(110, 69, 226, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Отмена
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const styles = {
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
    zIndex: 2000,
  },
  modal: {
    background: '#111112',
    padding: '40px',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: '400px',
    width: '90%',
    color: 'white',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    fontWeight: '600',
  },
  message: {
    fontSize: '1rem',
    opacity: 0.7,
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '30px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  confirm: {
    background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
    color: 'white',
  },
  cancel: {
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
  },
};

export default ReissueCardModal;