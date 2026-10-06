import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Features from '../components/Features';

const Landing = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`
  });

  return (
    <div style={{ color: 'white', width: '100%' }}>
      <section style={{ padding: '0 10%', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1, zIndex: 2 }}>
          <h1 style={{ fontSize: '5.5rem', lineHeight: '1.05', marginBottom: '25px', fontWeight: '800', ...animatedStyle(0) }}>
            БАНК <span style={{ color: '#88d3ce' }}>БУДУЩЕГО</span> <br /> В ТВОИХ РУКАХ
          </h1>
          
          <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '500px', marginBottom: '50px', lineHeight: '1.6', ...animatedStyle(0.2) }}>
            Управляй финансами в одно касание. Безопасность уровня "Паранойя", дизайн уровня "Искусство".
          </p>
          
          <div style={animatedStyle(0.4)}>
            <button 
              onClick={() => navigate('/login')}
              className="main-button"
              style={{
                padding: '20px 50px',
                fontSize: '1.1rem',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #6e45e2 0%, #a281f6 100%)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(110, 69, 226, 0.5)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(110, 69, 226, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(110, 69, 226, 0.5)';
              }}
            >
              Открыть счет бесплатно
            </button>
          </div>
        </div>

        <div style={{ flex: 1, perspective: '1000px', display: 'flex', justifyContent: 'center', position: 'relative', ...animatedStyle(0.6) }}>
          <div className="card-glow" style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(110, 69, 226, 0.2)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
          <div style={{ transform: loaded ? 'rotateY(-20deg) rotateX(10deg)' : 'rotateY(-60deg) rotateX(20deg)', transition: 'transform 1.5s ease 0.6s', animation: loaded ? 'floatCard 6s ease-in-out infinite alternate' : 'none', animationDelay: '2.1s' }}>
            {/* Карта с нейтральными данными для примера */}
            <Card 
              userName="CARD HOLDER" 
              cardNumber="0000 0000 0000 0000" 
              expiry="00/00" 
            />
          </div>
        </div>
      </section>

      <div style={animatedStyle(0.8)}>
        <Features />
      </div>

      <footer style={{ padding: '50px 10%', textAlign: 'center', opacity: 0.3, fontSize: '0.8rem' }}>
        © 2026 NEOBANK DIGITAL ASSETS. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
      </footer>
    </div>
  );
};

export default Landing;