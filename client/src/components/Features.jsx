import React from 'react';

const Features = () => {
  return (
    <section style={{ padding: '100px 10%', position: 'relative' }}>
      <h2 style={{ 
        fontSize: '3rem', 
        marginBottom: '60px', 
        fontWeight: '700',
        fontFamily: 'Montserrat' 
      }}>
        Почему выбирают <span style={{ color: '#88d3ce' }}>NEO</span>?
      </h2>

      <div className="bento-grid">
        {/* Аналитика */}
        <div className="bento-item item-large" style={{ justifyContent: 'flex-start', gap: '20px' }}>
          <div style={{ fontSize: '3rem' }}>📊</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#88d3ce' }}>Умная аналитика</h3>
            <p style={{ opacity: 0.7, lineHeight: '1.6', fontSize: '1.1rem' }}>
              Контролируйте свои расходы в реальном времени с помощью ИИ-алгоритмов.
            </p>
          </div>
        </div>

        {/* Безопасность */}
        <div className="bento-item item-medium" style={{ justifyContent: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <span style={{ fontSize: '2rem' }}>🛡️</span>
             <h3 style={{ fontSize: '1.5rem' }}>Безопасность военного уровня</h3>
          </div>
          <p style={{ opacity: 0.6, fontSize: '0.95rem' }}>
            Ваши данные защищены сквозным шифрованием по стандарту AES-256.
          </p>
        </div>

        {/* Мгновенные переводы */}
        <div className="bento-item" style={{ gap: '10px', justifyContent: 'center' }}>
          <div style={{ fontSize: '2rem' }}>⚡</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.3' }}>
            Мгновенные <br /> переводы
          </h3>
        </div>

        {/* Кэшбэк */}
        <div className="bento-item" style={{ gap: '10px', justifyContent: 'center' }}>
          <div style={{ fontSize: '2rem' }}>💎</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.3' }}>
            Самая лояльная <br /> кредитная ставка
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Features;