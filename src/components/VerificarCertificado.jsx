import React, { useEffect, useState } from 'react';

const VerificarCertificado = ({ codigo }) => {
  const [estado, setEstado] = useState('validando');
  const [certificado, setCertificado] = useState(null);

  useEffect(() => {
    // Simulación: este sería el fetch al backend
    setTimeout(() => {
      if (codigo === 'demo123') {
        setCertificado({
          codigoCatastral: '02-009-044-1-00-000-000',
          fechaEmision: '10/04/2025',
          zona: 'Cochabamba',
          tramite: 'N°: 2025000001',
          certificacion: 'N°: 12006',
          codigoControl: 'C2PEenkV',
          numeroInscripcion: '1020195'
        });
        setEstado('valido');
      } else {
        setEstado('invalido');
      }
    }, 1500);
  }, [codigo]);

  if (estado === 'validando') return <p>🔍 Validando certificado...</p>;
  if (estado === 'invalido') return <p style={{ color: 'red' }}>Certificado no válido o inexistente</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>Certificado válido</h2>
      <p><strong>Código Catastral:</strong> {certificado.codigoCatastral}</p>
      <p><strong>Fecha Emisión:</strong> {certificado.fechaEmision}</p>
      <p><strong>Zona:</strong> {certificado.zona}</p>
      <p><strong>Tramite:</strong> {certificado.tramite}</p>
      <p><strong>Certificación:</strong> {certificado.certificacion}</p>
      <p><strong>Codigo Control:</strong> {certificado.codigoControl}</p>
      <p><strong>Número de inscrioció:</strong> {certificado.numeroInscripcion}</p>
    </div>
  );
};

export default VerificarCertificado;
