import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Componente que muestra una alerta prominente cuando se intenta copiar el documento
 */
const AlertaCopia = () => {
  const alertaRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!alertaRef.current || !modalRef.current) return;

    // Dar foco al modal cuando aparece
    modalRef.current.focus();

    // Animación de entrada más dramática
    anime({
      targets: alertaRef.current,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });

    anime({
      targets: modalRef.current,
      scale: [0.8, 1],
      opacity: [0, 1],
      translateY: ['-30px', '0px'],
      duration: 500,
      easing: 'easeOutElastic(1, 0.8)'
    });

    // Animación de salida (después de 3 segundos)
    const animationTimeout = setTimeout(() => {
      if (alertaRef.current && modalRef.current) {
        // Primero animar el modal
        anime({
          targets: modalRef.current,
          scale: [1, 0.9],
          opacity: [1, 0],
          translateY: ['0px', '20px'],
          duration: 400,
          easing: 'easeInQuad'
        });
        
        // Luego animar el overlay
        anime({
          targets: alertaRef.current,
          opacity: [1, 0],
          duration: 300,
          delay: 200,
          easing: 'easeInQuad'
        });
      }
    }, 3000);

    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <div 
      className="alerta-copia-overlay" 
      ref={alertaRef} 
      style={{ 
        opacity: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="alerta-copia-modal" 
        ref={modalRef}
        tabIndex="-1" // Para poder recibir focus
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          outline: 'none' // Quitar el borde de focus
        }}
      >
        <div 
          className="alerta-copia-barra-superior" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, #D97706, #F59E0B)'
          }}
        />
        
        <div 
          className="alerta-copia-icono"
          style={{
            margin: '0 auto 1.5rem auto',
            width: '80px',
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7'
          }}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <circle cx="12" cy="12" r="10" fill="#FEF3C7" />
            <path d="M12 8v5M12 16v.01" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        
        <h3 
          className="alerta-copia-titulo"
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#D97706'
          }}
        >
          ¡Acción no permitida!
        </h3>
        
        <p 
          className="alerta-copia-mensaje"
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            lineHeight: '1.5',
            color: '#1F2937'
          }}
        >
          No está permitido copiar, descargar o imprimir este documento.
        </p>
        
        <p 
          className="alerta-copia-submensaje"
          style={{
            margin: '0',
            fontSize: '0.9rem',
            color: '#6B7280',
            fontStyle: 'italic'
          }}
        >
          Este documento está protegido por medidas de seguridad.
        </p>
      </div>
    </div>
  );
};

export default AlertaCopia;