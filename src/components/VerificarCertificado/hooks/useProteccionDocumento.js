import { useEffect } from 'react';

/**
 * Hook personalizado para proteger documentos contra copia, impresión y descarga
 * @param {React.RefObject} containerRef - Referencia al contenedor del documento
 * @param {Function} mostrarAlerta - Función para mostrar alerta cuando se intenta copiar
 * @param {boolean} activo - Indica si la protección está activa
 */
const useProteccionDocumento = (containerRef, mostrarAlerta, activo = true) => {
  useEffect(() => {
    if (!activo || !containerRef.current) return;

    // Prevenir clic derecho
    const handleContextMenu = (e) => {
      e.preventDefault();
      mostrarAlerta();
      return false;
    };

    // Prevenir atajos de teclado para copiar, guardar, imprimir
    const handleKeyDown = (e) => {
      // Ctrl+C, Ctrl+P, Ctrl+S, Ctrl+Shift+S, Ctrl+I
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'p' || e.key === 's' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && e.key === 's')
      ) {
        e.preventDefault();
        mostrarAlerta();
        return false;
      }
    };

    // Prevenir arrastrar imágenes
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevenir impresión
    const handleBeforePrint = (e) => {
      e.preventDefault();
      alert('🚫 No está permitido imprimir este documento.');
      return false;
    };

    // Prevenir selección de texto
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevenir copiar al portapapeles
    const handleCopy = (e) => {
      e.preventDefault();
      mostrarAlerta();
      return false;
    };

    // Añadir listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('beforeprint', handleBeforePrint);
    containerRef.current.addEventListener('selectstart', handleSelectStart);
    containerRef.current.addEventListener('copy', handleCopy);

    // Deshabilitar la API del portapapeles si está disponible
    const originalClipboardAPI = navigator.clipboard;
    let clipboardOverridden = false;
    
    if (navigator.clipboard) {
      try {
        clipboardOverridden = true;
        navigator.clipboard = {
          ...originalClipboardAPI,
          writeText: () => {
            mostrarAlerta();
            return Promise.reject(new Error('Copia no permitida'));
          },
          write: () => {
            mostrarAlerta();
            return Promise.reject(new Error('Copia no permitida'));
          }
        };
      } catch (error) {
        console.warn('No se pudo sobrescribir el API de clipboard:', error);
        clipboardOverridden = false;
      }
    }

    return () => {
      // Limpiar listeners
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('beforeprint', handleBeforePrint);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('selectstart', handleSelectStart);
        containerRef.current.removeEventListener('copy', handleCopy);
      }
      
      // Restaurar API del portapapeles
      if (clipboardOverridden) {
        try {
          navigator.clipboard = originalClipboardAPI;
        } catch (error) {
          console.warn('No se pudo restaurar el API de clipboard:', error);
        }
      }
    };
  }, [activo, containerRef, mostrarAlerta]);
};

export default useProteccionDocumento;