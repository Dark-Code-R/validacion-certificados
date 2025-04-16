import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Componente que muestra el encabezado cuando el certificado es válido
 */
const SuccessHeader = () => {
  const headerRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current || !iconRef.current || !textRef.current) return;
    
    // Animación para el icono
    anime({
      targets: iconRef.current,
      scale: [0, 1],
      opacity: [0, 1],
      rotate: [45, 0],
      duration: 800,
      easing: 'easeOutElastic(1, .8)'
    });

    // Animación para el texto
    anime({
      targets: textRef.current.querySelectorAll('h2, p, .entity-name'),
      translateX: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(200, {start: 400}),
      duration: 800,
      easing: 'easeOutQuad'
    });

    // Animación para el borde inferior
    anime({
      targets: headerRef.current,
      borderBottomWidth: [0, 1],
      duration: 1200,
      easing: 'easeInOutQuad'
    });
  }, []);

  return (
    <div className="success-header" ref={headerRef} style={{ 
      borderBottom: '1px solid #e0e0e0',
      padding: '1.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div className="success-icon" ref={iconRef} style={{ 
        opacity: 0,
        flexShrink: 0,
        width: '48px',
        height: '48px'
      }}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#D1FAE5" />
          <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="success-text" ref={textRef} style={{
        flex: 1
      }}>
        <h2 style={{ 
          opacity: 0,
          margin: '0 0 0.75rem 0',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#059669'
        }}>
          Certificado verificado correctamente
        </h2>
        <p style={{ 
          opacity: 0,
          margin: '0',
          fontSize: '1rem',
          lineHeight: '1.5',
          color: '#4B5563'
        }}>
          Este documento ha sido validado por la
          <span className="entity-name" style={{ 
            display: 'inline-block',
            margin: '0 0.3rem',
            fontWeight: '600',
            color: '#1F2937'
          }}>
            Dirección de Administración Geográfica y Catastro
          </span>
          del Gobierno Autónomo Municipal de Cochabamba
        </p>
      </div>
    </div>
  );
};

export default SuccessHeader;