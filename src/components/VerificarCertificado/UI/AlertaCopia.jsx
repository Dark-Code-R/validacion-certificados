import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Componente que muestra una alerta prominente cuando se intenta copiar el documento
 */
const AlertaCopia = () => {
  const alertaRef = useRef(null);

  useEffect(() => {
    if (!alertaRef.current) return;

    // Animación de entrada más dramática
    anime({
      targets: alertaRef.current,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutQuad'
    });

    // Animación de salida (después de 3 segundos)
    const animationTimeout = setTimeout(() => {
      if (alertaRef.current) {
        anime({
          targets: alertaRef.current,
          scale: [1, 0.8],
          opacity: [1, 0],
          duration: 500,
          easing: 'easeInQuad'
        });
      }
    }, 3000);

    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <div className="alerta-copia-overlay" ref={alertaRef} style={{ opacity: 0 }}>
      <div className="alerta-copia-modal">
        <div className="alerta-copia-icono">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <circle cx="12" cy="12" r="10" fill="#FEF3C7" />
            <path d="M12 8v5M12 16v.01" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="alerta-copia-titulo">¡Acción no permitida!</h3>
        <p className="alerta-copia-mensaje">
          No está permitido copiar, descargar o imprimir este documento.
        </p>
        <p className="alerta-copia-submensaje">
          Este documento está protegido por medidas de seguridad.
        </p>
      </div>
    </div>
  );
};

export default AlertaCopia;
