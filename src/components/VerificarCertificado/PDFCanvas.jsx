import React, { useEffect, useRef, useState } from 'react';

const PDFCanvas = ({ pdf, numero }) => {
  const canvasRef = useRef(null);
  const [documentId, setDocumentId] = useState('');

  // Generar un ID único para el documento
  useEffect(() => {
    const generateDocumentId = () => {
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 10000);
      return `GAMC-${timestamp}-${random}`;
    };
    
    setDocumentId(generateDocumentId());
  }, []);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf) return;
      
      const page = await pdf.getPage(numero);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Renderizar la página del PDF
      await page.render({ canvasContext: context, viewport }).promise;

      // Aplicar marca de agua mejorada con alta seguridad
      applySecureWatermark(context, canvas.width, canvas.height);
    };

    renderPage();
  }, [pdf, numero, documentId]);

  // Función principal para aplicar marca de agua con múltiples capas de seguridad
  const applySecureWatermark = (context, width, height) => {
    // Capa 1: Patrón de fondo con texto repetido y elementos de seguridad
    drawSecurityBackground(context, width, height);
    
    // Capa 2: Patrón moiré (efecto visual que es difícil de reproducir)
    drawMoirePattern(context, width, height);
    
    // Capa 3: Sello grande central con elementos holográficos
    drawEnhancedCentralSeal(context, width, height);
    
    // Capa 4: Marca de agua en esquina con información dinámica
    drawSecureCornerWatermark(context, width, height);
    
    // Capa 5: Microtexto (texto muy pequeño difícil de reproducir)
    drawMicrotext(context, width, height);
    
    // Capa 6: Elementos ocultos que solo aparecen al imprimir o copiar
    drawCopyDetection(context, width, height);
    
    // Capa 7: Guilloche (patrón de líneas entrelazadas como en billetes)
    drawGuilloche(context, width, height);
  };

  // Patrón de fondo con elementos de seguridad
  const drawSecurityBackground = (context, width, height) => {
    context.save();
  
    // Texto principal
    const text = 'VALIDADO - G.A.M. COCHABAMBA';
    const secondaryText = documentId;
    const fontSize = 26;
    const smallFontSize = 14;
    const spacing = 160;
  
    context.font = `bold ${fontSize}px Arial`;
    context.fillStyle = '#d05471';
    context.globalAlpha = 0.08; // Más visible
    context.textAlign = 'center';
    context.textBaseline = 'middle';
  
    // Aplicar rotación a toda la grilla
    context.translate(width / 2, height / 2);
    context.rotate(-Math.PI / 5);
  
    // Dibujar patrón principal
    for (let y = -height * 1.5; y < height * 1.5; y += spacing) {
      for (let x = -width * 1.5; x < width * 1.5; x += spacing) {
        context.fillText(text, x, y);
        
        // Añadir texto secundario con ID único
        context.font = `${smallFontSize}px Arial`;
        context.fillText(secondaryText, x, y + 25);
        context.font = `bold ${fontSize}px Arial`;
      }
    }
  
    // Añadir líneas de seguridad (como en billetes)
    context.globalAlpha = 0.05;
    context.lineWidth = 0.5;
    context.strokeStyle = '#d05471';
    
    for (let i = -width * 1.5; i < width * 1.5; i += 20) {
      context.beginPath();
      context.moveTo(i, -height * 1.5);
      context.lineTo(i, height * 1.5);
      context.stroke();
    }
  
    context.restore();
  };
  
  // Patrón moiré (efecto visual difícil de reproducir en fotocopias)
  const drawMoirePattern = (context, width, height) => {
    context.save();
    
    context.globalAlpha = 0.04;
    context.strokeStyle = '#d05471';
    context.lineWidth = 0.5;
    
    // Primer conjunto de círculos concéntricos
    const centerX1 = width * 0.3;
    const centerY1 = height * 0.3;
    
    for (let r = 10; r < Math.max(width, height) * 0.4; r += 10) {
      context.beginPath();
      context.arc(centerX1, centerY1, r, 0, Math.PI * 2);
      context.stroke();
    }
    
    // Segundo conjunto de círculos concéntricos
    const centerX2 = width * 0.7;
    const centerY2 = height * 0.7;
    
    for (let r = 10; r < Math.max(width, height) * 0.4; r += 10) {
      context.beginPath();
      context.arc(centerX2, centerY2, r, 0, Math.PI * 2);
      context.stroke();
    }
    
    context.restore();
  };

  // Sello central mejorado con elementos holográficos
  const drawEnhancedCentralSeal = (context, width, height) => {
    context.save();
    
    // Posicionar en el centro
    context.translate(width / 2, height / 2);
    
    // Crear efecto holográfico (gradiente radial)
    const gradient = context.createRadialGradient(0, 0, 10, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(208, 84, 113, 0.2)');
    gradient.addColorStop(0.5, 'rgba(84, 113, 208, 0.15)');
    gradient.addColorStop(1, 'rgba(208, 84, 113, 0.2)');
    
    // Dibujar círculo exterior
    context.beginPath();
    const radius = Math.min(width, height) * 0.2;
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.strokeStyle = 'rgba(208, 84, 113, 0.3)';
    context.lineWidth = 5;
    context.stroke();
    
    // Dibujar círculo interior
    context.beginPath();
    context.arc(0, 0, radius - 10, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(208, 84, 113, 0.3)';
    context.lineWidth = 2;
    context.stroke();
    
    // Texto central
    context.fillStyle = 'rgba(208, 84, 113, 0.6)'; // Más visible
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('CERTIFICADO', 0, -15);
    context.fillText('VALIDADO', 0, 15);
    
    // Fecha y hora de validación
    const fecha = new Date().toLocaleDateString('es-ES');
    const hora = new Date().toLocaleTimeString('es-ES');
    context.font = '16px Arial';
    context.fillText(fecha, 0, 45);
    context.fillText(hora, 0, 65);
    
    // ID único del documento
    context.font = '12px Arial';
    context.fillText(documentId, 0, 85);
    
    // Añadir elementos de seguridad adicionales
    // Líneas radiales
    context.globalAlpha = 0.2;
    for (let i = 0; i < 36; i++) {
      context.save();
      context.rotate(i * Math.PI / 18);
      context.beginPath();
      context.moveTo(radius - 20, 0);
      context.lineTo(radius + 20, 0);
      context.stroke();
      context.restore();
    }
    
    context.restore();
  };

  // Marca de agua en esquina mejorada
  const drawSecureCornerWatermark = (context, width, height) => {
    context.save();
    
    // Posicionar en la esquina inferior derecha
    context.translate(width - 120, height - 80);
    
    // Dibujar rectángulo con bordes redondeados y gradiente
    const gradient = context.createLinearGradient(-100, -30, 100, 30);
    gradient.addColorStop(0, 'rgba(208, 84, 113, 0.15)');
    gradient.addColorStop(0.5, 'rgba(113, 84, 208, 0.15)');
    gradient.addColorStop(1, 'rgba(208, 84, 113, 0.15)');
    
    context.beginPath();
    roundedRect(context, -100, -30, 200, 60, 10);
    context.fillStyle = gradient;
    context.fill();
    context.strokeStyle = 'rgba(208, 84, 113, 0.5)';
    context.lineWidth = 2;
    context.stroke();
    
    // Texto de validación
    context.fillStyle = 'rgba(208, 84, 113, 0.9)'; // Más visible
    context.font = 'bold 18px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('VALIDADO - GAMC', 0, -10);
    
    // Añadir ID único
    context.font = '12px Arial';
    context.fillText(documentId, 0, 10);
    
    context.restore();
  };

  // Microtexto (texto muy pequeño difícil de reproducir en fotocopias)
  const drawMicrotext = (context, width, height) => {
    context.save();
    
    const microText = 'GOBIERNO AUTÓNOMO MUNICIPAL DE COCHABAMBA - DOCUMENTO OFICIAL - NO VÁLIDO SIN SELLO - ';
    context.font = '4px Arial';
    context.fillStyle = 'rgba(208, 84, 113, 0.5)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Crear borde de microtexto
    const padding = 50;
    const textWidth = context.measureText(microText).width;
    const repeats = Math.ceil((width + height) * 2 / textWidth);
    let currentText = '';
    
    for (let i = 0; i < repeats; i++) {
      currentText += microText;
    }
    
    // Dibujar texto en los cuatro bordes
    // Superior
    context.save();
    context.translate(width/2, padding/2);
    for (let x = -width/2 + 10; x < width/2; x += textWidth) {
      context.fillText(microText, x, 0);
    }
    context.restore();
    
    // Inferior
    context.save();
    context.translate(width/2, height - padding/2);
    for (let x = -width/2 + 10; x < width/2; x += textWidth) {
      context.fillText(microText, x, 0);
    }
    context.restore();
    
    // Izquierdo
    context.save();
    context.translate(padding/2, height/2);
    context.rotate(-Math.PI/2);
    for (let x = -height/2 + 10; x < height/2; x += textWidth) {
      context.fillText(microText, x, 0);
    }
    context.restore();
    
    // Derecho
    context.save();
    context.translate(width - padding/2, height/2);
    context.rotate(Math.PI/2);
    for (let x = -height/2 + 10; x < height/2; x += textWidth) {
      context.fillText(microText, x, 0);
    }
    context.restore();
    
    context.restore();
  };

  // Elementos que solo aparecen al imprimir o copiar
  const drawCopyDetection = (context, width, height) => {
    context.save();
    
    // Texto que aparece más visible en copias
    context.font = 'bold 72px Arial';
    context.fillStyle = 'rgba(255, 0, 0, 0.01)'; // Casi invisible en pantalla
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.globalAlpha = 0.01;
    
    // Texto diagonal grande
    context.translate(width/2, height/2);
    context.rotate(-Math.PI/4);
    context.fillText('COPIA NO VÁLIDA', 0, 0);
    context.rotate(Math.PI/2);
    context.fillText('COPIA NO VÁLIDA', 0, 0);
    
    context.restore();
  };

  // Patrón de guilloche (como en billetes)
  const drawGuilloche = (context, width, height) => {
    context.save();
    
    context.strokeStyle = 'rgba(208, 84, 113, 0.05)';
    context.lineWidth = 0.5;
    
    // Dibujar patrón de guilloche
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    for (let i = 0; i < 360; i += 5) {
      const angle1 = (i * Math.PI) / 180;
      const angle2 = ((i + 2) * Math.PI) / 180;
      
      const radius1 = maxRadius + Math.sin(i * 5 * Math.PI / 180) * 20;
      const radius2 = maxRadius + Math.sin((i + 2) * 5 * Math.PI / 180) * 20;
      
      const x1 = centerX + Math.cos(angle1) * radius1;
      const y1 = centerY + Math.sin(angle1) * radius1;
      const x2 = centerX + Math.cos(angle2) * radius2;
      const y2 = centerY + Math.sin(angle2) * radius2;
      
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }
    
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
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      }}
    />
  );
};

export default PDFCanvas;