import React, { useEffect, useRef } from 'react';

/**
 * Componente que muestra el pie de página del certificado
 * @param {string} codigo - Código de verificación del certificado
 */
const CertificadoFooter = ({ codigo }) => {
  const textRef = useRef(null);

  useEffect(() => {
    // Efecto de resaltado suave para el texto
    if (textRef.current) {
      const pulseEffect = () => {
        const element = textRef.current;
        if (!element) return;
        
        // Animación de pulso suave
        element.style.transition = 'background-color 2s ease-in-out';
        element.style.backgroundColor = 'rgba(208, 84, 113, 0.08)';
        
        setTimeout(() => {
          element.style.backgroundColor = 'transparent';
        }, 2000);
      };
      
      // Iniciar el efecto y repetirlo cada 5 segundos
      pulseEffect();
      const interval = setInterval(pulseEffect, 5000);
      
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="certificado-footer" style={{
      marginTop: '2rem',
      padding: '1.5rem',
      borderTop: '1px solid #e0e0e0',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <p style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '1.5rem'
      }}>
        Fecha de verificación: <span style={{ fontWeight: 'bold', color: '#333' }}>
          {new Date().toLocaleDateString('es-ES')}
        </span>
      </p>
      
      <div className="advertencia-seguridad" style={{
        padding: '1rem',
        margin: '0 auto',
        maxWidth: '600px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
      }}>
        <p ref={textRef} style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#d05471',
          fontWeight: '500',
          padding: '0.75rem',
          margin: 0,
          borderRadius: '4px',
          transition: 'background-color 2s ease-in-out',
          letterSpacing: '0.02em'
        }}>
          Este documento está protegido. No se permite copiar, descargar o imprimir.
        </p>
      </div>
    </div>
  );
};

export default CertificadoFooter;