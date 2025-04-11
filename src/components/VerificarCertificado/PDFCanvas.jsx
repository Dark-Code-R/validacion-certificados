import React, { useEffect, useRef } from 'react';

const PDFCanvas = ({ pdf, numero }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderPage = async () => {
      const page = await pdf.getPage(numero);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      // Marca de agua
      context.font = '30px Arial';
      context.fillStyle = 'rgba(200,0,0,0.3)';
      context.fillText('VALIDADO - GAMC', 50, 50);
    };

    renderPage();
  }, [pdf, numero]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        marginBottom: '1rem',
        pointerEvents: 'none',
        userSelect: 'none',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    />
  );
};

export default PDFCanvas;
