import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>NEO<span style={{ color: '#88d3ce' }}>BANK</span></h2>
          <p style={styles.subtitle}>Добро пожаловать в будущее финансов</p>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Адрес</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#6e45e2'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#88d3ce'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
            />
          </div>
          <button type="submit" style={styles.button}>
            Войти в кабинет
          </button>
        </form>
        <p style={styles.registerLink}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
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
  header: {
    textAlign: 'center',
    marginBottom: '20px'   
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
    marginTop: '8px',
    marginBottom: '0',
    fontSize: '0.9rem'
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: '0',
    marginBottom: '20px',   
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '0'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
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
    padding: '18px 22px',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.03)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  button: {
    marginTop: '5px',
    padding: '20px',
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
  registerLink: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: '25px'
  }
};

export default Login;