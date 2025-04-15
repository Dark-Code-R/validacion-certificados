import React, { useEffect, useRef } from 'react';
import PDFCanvas from '../PDFCanvas';
import anime from 'animejs';

/**
 * Componente que muestra las páginas de un PDF
 * @param {Array} paginas - Array de objetos con información de las páginas
 */
const PDFViewer = ({ paginas }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || paginas.length === 0) return;
    
    // Seleccionar todas las páginas del PDF
    const pdfPages = containerRef.current.querySelectorAll('.pdf-page');
    
    // Animar cada página con un retraso escalonado
    anime({
      targets: pdfPages,
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      duration: 800,
      easing: 'easeOutQuad'
    });
  }, [paginas]);

  return (
    <div className="pdf-container" ref={containerRef}>
      {paginas.map((p, index) => (
        <div key={index} className="pdf-page" style={{ opacity: 0 }}>
          <PDFCanvas pdf={p.pdf} numero={p.numero} />
          <div className="page-number">Página {p.numero} de {paginas.length}</div>
        </div>
      ))}
    </div>
  );
};

export default PDFViewer;
