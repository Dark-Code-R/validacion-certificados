
import React, { useLayoutEffect, useState, useRef } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import PDFCanvas from './PDFCanvas';
import LoadingMessage from './LoadingMessage';
import ErrorMessage from './ErrorMessage';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const VerificarCertificado = ({ codigo }) => {
  const [estado, setEstado] = useState('validando');
  const [paginas, setPaginas] = useState([]);
  const [error, setError] = useState('');
  const pdfUrlRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  // Validar formato del código (puedes ajustar según tus necesidades)
  const esCodigoValido = (cod) => {
    return cod && typeof cod === 'string' && cod.trim().length > 0;
  };

  useLayoutEffect(() => {
    const fetchPDF = async () => {
      // Limpiar recursos previos
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
        pdfUrlRef.current = null;
      }

      // Cancelar petición anterior si existe
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      if (!esCodigoValido(codigo)) {
        setEstado('invalido');
        setError('No se proporcionó un código válido');
        return;
      }

      try {
        const formData = new URLSearchParams();
        formData.append('cod', codigo);

        const response = await fetch('https://qrback.catastrocochabamba.com/obtenerCertificacionPDF', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Error ${response.status}: No se pudo obtener el certificado`);
        }

        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        pdfUrlRef.current = pdfUrl;
        
        const pdf = await getDocument(pdfUrl).promise;

        setPaginas(Array.from({ length: pdf.numPages }, (_, i) => ({ pdf, numero: i + 1 })));
        setEstado('valido');
      } catch (err) {
        // No mostrar errores si la petición fue abortada intencionalmente
        if (err.name === 'AbortError') return;
        
        console.error("Error al renderizar el PDF:", err);
        setEstado('invalido');
        setError(err.message || 'Error inesperado al procesar el certificado');
      }
    };

    fetchPDF();

    // Limpieza al desmontar o cuando cambia el código
    return () => {
      abortControllerRef.current.abort();
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
        pdfUrlRef.current = null;
      }
    };
  }, [codigo]);

  if (estado === 'validando') return <LoadingMessage />;
  if (estado === 'invalido') return <ErrorMessage mensaje={error} />;

  return (
    <div style={{ padding: '1rem' }}>
      {paginas.map((p, index) => (
        <PDFCanvas key={index} pdf={p.pdf} numero={p.numero} />
      ))}
    </div>
  );
};

export default VerificarCertificado;
