import React, { useLayoutEffect, useRef, useState } from 'react';
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

  useLayoutEffect(() => {
    const fetchPDF = async () => {
      if (!codigo) {
        setEstado('invalido');
        setError('No se proporcionó un código');
        return;
      }

      try {
        const formData = new URLSearchParams();
        formData.append('cod', codigo);

        const response = await fetch('http://172.16.67.251:8010/obtenerCertificacionPDF', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });

        if (!response.ok) throw new Error('No se pudo obtener el certificado');

        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        const pdf = await getDocument(pdfUrl).promise;

        setPaginas(Array.from({ length: pdf.numPages }, (_, i) => ({ pdf, numero: i + 1 })));
        setEstado('valido');
      } catch (err) {
        console.error("Error al renderizar el PDF:", err);
        setEstado('invalido');
        setError(err.message || 'Error inesperado');
      }
    };

    fetchPDF();
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
