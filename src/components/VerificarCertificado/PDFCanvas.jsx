import React, { useEffect, useRef, useState } from 'react';
import AlertaCopia from './UI/AlertaCopia';

const PDFCanvas = ({ pdf, numero }) => {
  const canvasRef = useRef(null);
  const [validationText] = useState('USO EXCLUSIVO DE VERIFICACIÓN');
  const [showAlert, setShowAlert] = useState(false);

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

    // Añadir listeners para detectar intentos de copia
    const handleCopyAttempt = (e) => {
      e.preventDefault();
      setShowAlert(true);
    };

    document.addEventListener('copy', handleCopyAttempt);
    document.addEventListener('contextmenu', handleCopyAttempt);
    
    // También podemos detectar teclas como Print Screen
    const handleKeyDown = (e) => {
      // Detectar Print Screen (código 44)
      if (e.keyCode === 44) {
        e.preventDefault();
        setShowAlert(true);
      }
      
      // Detectar Ctrl+P (imprimir)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        setShowAlert(true);
      }
      
      // Detectar Ctrl+S (guardar)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        setShowAlert(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopyAttempt);
      document.removeEventListener('contextmenu', handleCopyAttempt);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pdf, numero, validationText]);

  // Función principal para aplicar marca de agua con múltiples capas de seguridad
  const applySecureWatermark = (context, width, height) => {
    // Capa 1: Patrón de fondo con texto repetido y elementos de seguridad
    drawSecurityBackground(context, width, height);
    
    // Capa 2: Patrón moiré (efecto visual que es difícil de reproducir)
    drawMoirePattern(context, width, height);
    
    // Capa 3: Sello grande central con elementos holográficos
    drawEnhancedCentralSeal(context, width, height);
    
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
    const text = 'VALIDADO-GAMC-2024'; // Añadido espacio para mejor legibilidad
    const secondaryText = validationText;
    const fontSize = 28;
    const smallFontSize = 18; // Tamaño más grande para mejor legibilidad
    const spacing = 180;
  
    context.font = `bold ${fontSize}px Arial`;
    context.fillStyle = '#d05471';
    context.globalAlpha = 0.15;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
  
    // Aplicar rotación a toda la grilla
    context.translate(width / 2, height / 2);
    context.rotate(-Math.PI / 5); // Rotación original (~36 grados)

    const columnSpacing = spacing * 1.8; // Más espacio horizontal
    const rowSpacing = spacing * 1.5; // Más espacio vertical

    // Formatear el texto principal con separadores
    const formattedMainText = "- " + text + " -"; // Añadir estrellas como separadores visuales

    // Formatear el texto secundario con separadores
    const formattedSecondaryText = "- " + secondaryText + " -"; // Añadir guiones como separadores visuales

    for (let y = -height * 1.5; y < height * 1.5; y += rowSpacing) {
      for (let x = -width * 1.5; x < width * 1.5; x += columnSpacing) {
        // Texto principal con fondo y separadores
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = '#d05471';
        
        // Dibujar un fondo sutil para el texto principal
        const mainTextWidth = context.measureText(formattedMainText).width;
        context.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Fondo semitransparente
        context.fillRect(x - mainTextWidth/2 - 10, y - fontSize/2 - 5, mainTextWidth + 20, fontSize + 10);
        
        // Dibujar el texto principal
        context.fillStyle = '#d05471';
        context.fillText(formattedMainText, x, y);

        // Texto secundario con separadores visuales
        context.font = `bold ${smallFontSize}px Arial`;
        context.fillStyle = '#333'; // Contraste alto para visibilidad
        
        // Dibujar un fondo sutil para el texto secundario
        const secondaryTextWidth = context.measureText(formattedSecondaryText).width;
        context.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Fondo semitransparente
        context.fillRect(x - secondaryTextWidth/2 - 10, y + 40 - smallFontSize/2 - 5, secondaryTextWidth + 20, smallFontSize + 10);
        
        // Dibujar el texto secundario
        context.fillStyle = '#333';
        context.fillText(formattedSecondaryText, x, y + 40);
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
    context.fillStyle = 'rgba(208, 84, 113, 0.7)';
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

  // Microtexto (texto muy pequeño difícil de reproducir en fotocopias)
  const drawMicrotext = (context, width, height) => {
    context.save();
    
    const microText = 'GOBIERNO AUTÓNOMO MUNICIPAL DE COCHABAMBA - DOCUMENTO OFICIAL - NO VÁLIDO SIN SELLO - ';
    context.font = '4px Arial';
    context.fillStyle = 'rgba(208, 84, 113, 0.6)';
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

  return (
    <>
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
      
      {showAlert && <AlertaCopia onClose={() => setShowAlert(false)} />}
    </>
  );
};

export default PDFCanvas;