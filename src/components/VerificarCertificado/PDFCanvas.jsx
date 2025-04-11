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

      // Renderizar la página del PDF
      await page.render({ canvasContext: context, viewport }).promise;

      // Aplicar marca de agua mejorada
      applyWatermark(context, canvas.width, canvas.height);
    };

    renderPage();
  }, [pdf, numero]);

  // Función para aplicar marca de agua con múltiples capas
  const applyWatermark = (context, width, height) => {
    // Capa 1: Patrón de fondo con texto repetido
    drawRepeatingPattern(context, width, height);
    
    // Capa 2: Sello grande central
    drawCentralSeal(context, width, height);
    
    // Capa 3: Marca de agua en esquina
    drawCornerWatermark(context, width, height);
  };

  // Patrón de fondo con texto repetido
  const drawRepeatingPattern = (context, width, height) => {
    context.save();
    
    // Configuración para el patrón de fondo
    context.globalAlpha = 0.06; // Muy transparente para no interferir con la legibilidad
    context.translate(width / 2, height / 2);
    context.rotate(-Math.PI / 4); // Rotar 45° para fondo diagonal
    
    // Estilo del texto
    context.font = 'bold 30px Arial';
    context.fillStyle = '#d05471';
    context.textAlign = 'center';
    
    const text = 'VALIDADO - GAMC';
    const spacing = 180; // Espaciado entre repeticiones
    
    // Dibujar el patrón repetido
    for (let y = -height * 1.5; y < height * 1.5; y += spacing) {
      for (let x = -width * 1.5; x < width * 1.5; x += spacing) {
        context.fillText(text, x, y);
      }
    }
    
    context.restore();
  };

  // Sello grande central
  const drawCentralSeal = (context, width, height) => {
    context.save();
    
    // Posicionar en el centro
    context.translate(width / 2, height / 2);
    
    // Dibujar círculo exterior
    context.beginPath();
    const radius = Math.min(width, height) * 0.2; // Tamaño proporcional al documento
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(208, 84, 113, 0.15)';
    context.lineWidth = 5;
    context.stroke();
    
    // Dibujar círculo interior
    context.beginPath();
    context.arc(0, 0, radius - 10, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(208, 84, 113, 0.15)';
    context.lineWidth = 2;
    context.stroke();
    
    // Texto central
    context.fillStyle = 'rgba(208, 84, 113, 0.2)';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('CERTIFICADO', 0, -15);
    context.fillText('VALIDADO', 0, 15);
    
    // Fecha de validación
    const fecha = new Date().toLocaleDateString('es-ES');
    context.font = '16px Arial';
    context.fillText(fecha, 0, 45);
    
    context.restore();
  };

  // Marca de agua en esquina
  const drawCornerWatermark = (context, width, height) => {
    context.save();
    
    // Posicionar en la esquina inferior derecha
    context.translate(width - 120, height - 80);
    
    // Dibujar rectángulo con bordes redondeados
    context.beginPath();
    roundedRect(context, -100, -30, 200, 60, 10);
    context.fillStyle = 'rgba(208, 84, 113, 0.1)';
    context.fill();
    context.strokeStyle = 'rgba(208, 84, 113, 0.3)';
    context.lineWidth = 2;
    context.stroke();
    
    // Texto de validación
    context.fillStyle = 'rgba(208, 84, 113, 0.7)';
    context.font = 'bold 18px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('VALIDADO - GAMC', 0, 0);
    
    context.restore();
  };

  // Función auxiliar para dibujar rectángulos con bordes redondeados
  const roundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

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