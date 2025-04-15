import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Componente que muestra un indicador de carga con progreso
 * @param {number} progreso - Porcentaje de progreso (0-100)
 */
const LoadingMessage = ({ progreso }) => {
  const cardRef = useRef(null);
  const progressRef = useRef(null);
  const textRef = useRef(null);
  const spinnerRef = useRef(null);

  // Animación inicial de la tarjeta
  useEffect(() => {
    if (!cardRef.current) return;
    
    anime({
      targets: cardRef.current,
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutQuad'
    });

    // Animación continua del spinner
    anime({
      targets: spinnerRef.current,
      rotate: '360deg',
      duration: 1500,
      loop: true,
      easing: 'linear'
    });
  }, []);

  // Animación de la barra de progreso y texto
  useEffect(() => {
    if (!progressRef.current || !textRef.current) return;
    
    // Animación del texto cuando cambia
    anime({
      targets: textRef.current,
      opacity: [0.5, 1],
      translateY: [5, 0],
      duration: 300,
      easing: 'easeOutQuad'
    });

    // Animación suave de la barra de progreso
    anime({
      targets: progressRef.current,
      width: `${progreso}%`,
      duration: 800,
      easing: 'easeInOutQuad'
    });
  }, [progreso]);

  return (
    <div className="loading-container">
      <div className="loading-card" ref={cardRef} style={{ opacity: 0 }}>
        <div className="loading-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle 
              className="spinner" 
              cx="12" 
              cy="12" 
              r="10" 
              fill="none" 
              strokeWidth="2" 
              ref={spinnerRef}
            />
          </svg>
        </div>
        <h3>Verificando certificado</h3>
        <div className="progress-bar">
          <div className="progress-fill" ref={progressRef} style={{ width: '0%' }}></div>
        </div>
        <p ref={textRef}>
          {progreso < 20 && "Preparando solicitud..."}
          {progreso >= 20 && progreso < 50 && "Conectando con el servidor..."}
          {progreso >= 50 && progreso < 70 && "Descargando certificado..."}
          {progreso >= 70 && progreso < 90 && "Procesando documento..."}
          {progreso >= 90 && "Finalizando..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingMessage;
