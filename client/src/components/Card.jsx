import React from 'react';

const Card = ({ userName = "CARD HOLDER", cardNumber = "0000 0000 0000 0000", expiry = "00/00" }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',        
      height: '280px',          
      borderRadius: '25px',
      background: 'linear-gradient(135deg, #6e45e2 0%, #a281f6 40%, #88d3ce 100%)',
      padding: '30px',
      color: 'white',
      fontFamily: 'Montserrat, sans-serif',
      boxShadow: '0 20px 50px rgba(110, 69, 226, 0.4)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-10%',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
        transform: 'rotate(-20deg)',
        pointerEvents: 'none',
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px' }}>NEOBANK</div>
        <div style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9 }}>VISA</div>
      </div>

      <div style={{ 
        fontSize: '1.5rem', 
        letterSpacing: '2px', 
        fontWeight: '500', 
        zIndex: 1, 
        margin: '15px 0',
        whiteSpace: 'nowrap',
      }}>
        {cardNumber}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>
            CARD HOLDER
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {userName}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>
            EXPIRES
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '600' }}>
            {expiry}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;