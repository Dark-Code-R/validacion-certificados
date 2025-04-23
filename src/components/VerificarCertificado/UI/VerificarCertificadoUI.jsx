import React, { useRef, useEffect } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import anime from 'animejs';
import './VerificarCertificadoUI.css';

// Hooks personalizados
import useFetchPDF from '../hooks/useFetchPDF';
import useProteccionDocumento from '../hooks/useProteccionDocumento';
import useAlertaTemporal from '../hooks/useAlertaTemporal';

// Componentes UI
import AlertaCopia from './AlertaCopia';
import LoadingMessage from './LoadingMessage';
import ErrorMessage from './ErrorMessage';
import SuccessHeader from './SuccessHeader';
import PDFViewer from './PDFViewer';
import CertificadoFooter from './CertificadoFooter';

// Configuración de PDF.js
GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Configuración de la API
const API_BASE = process.env.REACT_APP_API_BASE;
const API_ENDPOINT = `${API_BASE}/obtenerCertificacionPDF`;

/**
 * Componente principal para verificar y mostrar certificados
 * @param {string} codigo - Código del certificado a verificar
 */
const VerificarCertificadoUI = ({ codigo }) => {
  const containerRef = useRef(null);
  const [mostrarAlertaCopia, activarAlerta] = useAlertaTemporal(3000);
  
  // Obtener el PDF
  const { estado, paginas, error, progreso, detallesError } = useFetchPDF(codigo, API_ENDPOINT);
  
  // Aplicar protecciones contra copia
  useProteccionDocumento(containerRef, activarAlerta, estado === 'valido');

  // Animar el contenedor cuando cambia el estado a 'valido'
  useEffect(() => {
    if (estado === 'valido' && containerRef.current) {
      // Animar la entrada del contenedor
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutQuad'
      });
    }
  }, [estado]);

  // Renderizar según el estado
  if (estado === 'validando') return <LoadingMessage progreso={progreso} />;
  if (estado === 'invalido') return <ErrorMessage mensaje={error} detalles={detallesError} />;

  return (
    <div className="certificado-container" ref={containerRef} style={{ opacity: 0 }}>
      {mostrarAlertaCopia && <AlertaCopia />}
      <SuccessHeader />
      <PDFViewer paginas={paginas} />
      <CertificadoFooter codigo={codigo} />
    </div>
  );
};

export default VerificarCertificadoUI;
