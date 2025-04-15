import React from 'react';

/**
 * Componente que muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error principal
 * @param {Object} detalles - Detalles adicionales del error
 */
const ErrorMessage = ({ mensaje, detalles }) => (
  <div className="error-container">
    <div className="error-card">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
          <path d="M12 8v5M12 16v.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3>Certificado no válido</h3>
      <p>{mensaje}</p>
      
      {detalles?.sugerencia && (
        <div className="error-details">
          <p className="error-suggestion">{detalles.sugerencia}</p>
        </div>
      )}
      
      <div className="error-actions">
        <button className="retry-button" onClick={() => window.location.reload()}>
          Intentar nuevamente
        </button>
      </div>
    </div>
  </div>
);

export default ErrorMessage;