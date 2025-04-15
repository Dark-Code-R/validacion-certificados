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
      targets: textRef.current.querySelectorAll('h2, p'),
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
    <div className="success-header" ref={headerRef}>
      <div className="success-icon" ref={iconRef} style={{ opacity: 0 }}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#D1FAE5" />
          <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="success-text" ref={textRef}>
        <h2 style={{ opacity: 0 }}>Certificado verificado correctamente</h2>
        <p style={{ opacity: 0 }}>Este documento ha sido validado por el Gobierno Autónomo Municipal de Cochabamba</p>
      </div>
    </div>
  );
};

export default SuccessHeader;
