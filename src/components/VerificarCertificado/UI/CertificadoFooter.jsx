import React from 'react';

/**
 * Componente que muestra el pie de página del certificado
 * @param {string} codigo - Código de verificación del certificado
 */
const CertificadoFooter = ({ codigo }) => (
  <div className="certificado-footer">
    <p>Fecha de verificación: {new Date().toLocaleDateString('es-ES')}</p>
    <p>Código de verificación: {codigo}</p>
    <div className="advertencia-seguridad">
      <p>Este documento está protegido. No se permite copiar, descargar o imprimir.</p>
      <p>Para obtener una copia oficial, acuda a las oficinas del GAMC.</p>
    </div>
  </div>
);

export default CertificadoFooter;