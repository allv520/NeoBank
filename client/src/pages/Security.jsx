import React from 'react';

const Security = () => {
  const securityFeatures = [
    { title: "Шифрование AES-256", desc: "Ваши данные и транзакции защищены протоколами банковского уровня. Даже мы не имеем доступа к вашим паролям.", icon: "🔐", size: "large" },
    { title: "Биометрия", desc: "Мгновенный и безопасный доступ по Face ID или Touch ID.", icon: "👤" },
    { title: "Анти-фрод", desc: "ИИ анализирует подозрительные действия и блокирует их за 0.1 сек.", icon: "🤖" },
    { title: "Страхование", desc: "Все вклады застрахованы на сумму до 1 400 000 ₽.", icon: "🏛️" },
    { title: "Виртуальные карты", desc: "Создавайте одноразовые реквизиты для безопасных покупок в интернете.", icon: "💳" }
  ];

  return (
    <div className="page-fade-in" style={{ 
      padding: '80px 10%', 
      color: 'white', 
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      
      <div style={{
        position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px',
        background: 'rgba(110, 69, 226, 0.1)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%', width: '350px', height: '350px',
        background: 'rgba(136, 211, 206, 0.1)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1
      }}></div>

      <div style={{ marginBottom: '60px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '1.1' }}>
          Ваша <span style={{ color: '#88d3ce' }}>безопасность</span> — <br /> наш приоритет
        </h1>
        <p style={{ opacity: 0.5, maxWidth: '600px', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Мы объединили криптографию военного уровня и искусственный интеллект, чтобы ваши финансы были под абсолютной защитой.
        </p>
      </div>

<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(3, 1fr)', 
  gap: '25px',
  alignItems: 'stretch'
}}>
  {securityFeatures.map((f, i) => (
    <div key={i} className="bento-item" style={{ 
      padding: '40px', 
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gridColumn: f.size === "large" ? "span 2" : "span 1",
      minHeight: '300px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ fontSize: '3rem', height: '60px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        {f.icon}
      </div>

      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        marginBottom: '15px', 
        fontFamily: 'Montserrat',
        minHeight: '3.6rem', 
        display: 'flex',
        alignItems: 'flex-start'
      }}>
        {f.title}
      </h3>

      <p style={{ 
        opacity: 0.5, 
        fontSize: '0.95rem', 
        lineHeight: '1.6',
        margin: 0 
      }}>
        {f.desc}
      </p>
    </div>
  ))}
    </div>

      <footer style={{ marginTop: '100px', opacity: 0.2, fontSize: '0.8rem', textAlign: 'center' }}>
        NEO SYNC SECURITY PROTOCOL v2.4 // AES-256 ENABLED
      </footer>
    </div>
  );
};

export default Security;