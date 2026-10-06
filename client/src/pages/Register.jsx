import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={styles.title}>NEO<span style={{ color: '#88d3ce' }}>BANK</span></h2>
          <p style={styles.subtitle}>Создайте аккаунт</p>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#6e45e2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Имя</label>
            <input
              type="text"
              name="firstName"
              placeholder="Александра"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#6e45e2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Фамилия (необязательно)</label>
            <input
              type="text"
              name="lastName"
              placeholder="Иванова"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#6e45e2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#88d3ce'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02) translateY(-2px)';
              e.target.style.boxShadow = '0 20px 45px rgba(110, 69, 226, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = '0 15px 35px rgba(110, 69, 226, 0.3)';
            }}
          >
            Зарегистрироваться
          </button>
        </form>

        <p style={styles.loginLink}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050505',
    backgroundImage: `
      radial-gradient(circle at 10% 20%, rgba(110, 69, 226, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(136, 211, 206, 0.1) 0%, transparent 40%)
    `,
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif"
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(25px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '40px',
    padding: '60px 50px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), 0 0 80px rgba(110, 69, 226, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-1px'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    marginTop: '10px',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginLeft: '5px'
  },
  input: {
    padding: '16px 20px',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.03)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  button: {
    marginTop: '10px',
    padding: '18px',
    borderRadius: '20px',
    border: 'none',
    background: 'linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%)',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 15px 35px rgba(110, 69, 226, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '15px',
    textAlign: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: '10px',
    borderRadius: '12px'
  },
  loginLink: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: '20px',
  }
};

export default Register;