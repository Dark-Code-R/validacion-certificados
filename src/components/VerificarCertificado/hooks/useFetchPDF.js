import { useState, useRef, useLayoutEffect } from 'react';
import { getDocument } from 'pdfjs-dist';

/**
 * Hook personalizado para obtener y procesar un PDF
 * @param {string} codigo - Código del certificado a verificar
 * @param {string} apiEndpoint - URL del endpoint de la API
 * @returns {Object} Estado de la operación, páginas, error y progreso
 */
const useFetchPDF = (codigo, apiEndpoint) => {
  const [estado, setEstado] = useState('validando');
  const [paginas, setPaginas] = useState([]);
  const [error, setError] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [detallesError, setDetallesError] = useState(null);
  const pdfUrlRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  // Validar formato del código
  const esCodigoValido = (cod) => cod && typeof cod === 'string' && cod.trim().length > 0;

  // Función para manejar errores de red
  const manejarErrorRed = (err) => {
    console.error("Error de conexión:", err);
    let mensajeError = 'Error inesperado al procesar el certificado';
    let detalles = null;

    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      detalles = { tipo: 'conexion', sugerencia: 'Compruebe su conexión a internet.' };
    } else if (err.message.includes('certificate') || err.message.includes('SSL')) {
      mensajeError = 'Error de seguridad en la conexión con el servidor.';
      detalles = { tipo: 'seguridad', sugerencia: 'Verifique el certificado SSL del servidor.' };
    } else if (err.message.includes('timeout')) {
      mensajeError = 'La conexión ha tardado demasiado tiempo.';
      detalles = { tipo: 'timeout', sugerencia: 'El servidor está ocupado. Intente más tarde.' };
    } else if (err.message.includes('CORS')) {
      mensajeError = 'Error de acceso al servidor (CORS).';
      detalles = { tipo: 'cors', sugerencia: 'Contacte al administrador del sistema.' };
    }

    setEstado('invalido');
    setError(mensajeError);
    setDetallesError(detalles);
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
      
      // Reiniciar estados
      setDetallesError(null);
      setProgreso(0);

      if (!esCodigoValido(codigo)) {
        setEstado('invalido');
        setError('No se proporcionó un código válido');
        return;
      }

      try {
        setProgreso(10);
        const formData = new URLSearchParams();
        formData.append('cod', codigo);

        setProgreso(20);
        const timeoutId = setTimeout(() => abortControllerRef.current.abort(), 30000);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/pdf' },
          body: formData,
          signal: abortControllerRef.current.signal,
          credentials: 'same-origin'
        });

        clearTimeout(timeoutId);
        setProgreso(50);

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
          throw new Error('La respuesta no es un PDF válido.');
        }

        const blob = await response.blob();
        if (blob.size === 0) throw new Error('El servidor devolvió un documento vacío.');

        const pdfUrl = URL.createObjectURL(blob);
        pdfUrlRef.current = pdfUrl;
        setProgreso(70);

        const pdf = await getDocument(pdfUrl).promise;
        if (pdf.numPages === 0) throw new Error('El PDF no contiene páginas.');

        setPaginas(Array.from({ length: pdf.numPages }, (_, i) => ({ pdf, numero: i + 1 })));
        setProgreso(100);
        setEstado('valido');
      } catch (err) {
        if (err.name !== 'AbortError') manejarErrorRed(err);
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
  }, [codigo, apiEndpoint]);

  return { estado, paginas, error, progreso, detallesError };
};

export default useFetchPDF;