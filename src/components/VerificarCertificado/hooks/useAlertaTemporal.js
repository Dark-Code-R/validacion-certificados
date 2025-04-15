import { useState, useCallback } from 'react';

/**
 * Hook personalizado para mostrar alertas temporales
 * @param {number} duracion - Duración en milisegundos que se mostrará la alerta
 * @returns {Array} Estado de la alerta y función para mostrarla
 */
const useAlertaTemporal = (duracion = 3000) => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  
  const activarAlerta = useCallback(() => {
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), duracion);
  }, [duracion]);
  
  return [mostrarAlerta, activarAlerta];
};

export default useAlertaTemporal;