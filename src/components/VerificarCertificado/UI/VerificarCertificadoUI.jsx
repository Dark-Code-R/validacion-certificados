import React, { useLayoutEffect, useState, useRef } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import PDFCanvas from '../PDFCanvas';
import './VerificarCertificadoUI.css'; 

GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Configuración de la API - Esto podría moverse a un archivo de configuración
const API_BASE = process.env.REACT_APP_API_BASE || 'https://qrback.catastrocochabamba.com';
const API_ENDPOINT = `${API_BASE}/obtenerCertificacionPDF`;

const VerificarCertificadoUI = ({ codigo }) => {
  const [estado, setEstado] = useState('validando');
  const [paginas, setPaginas] = useState([]);
  const [error, setError] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [detallesError, setDetallesError] = useState(null);
  const pdfUrlRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  // Validar formato del código
  const esCodigoValido = (cod) => {
    return cod && typeof cod === 'string' && cod.trim().length > 0;
  };

  // Función para manejar errores de red
  const manejarErrorRed = (err) => {
    console.error("Error de conexión:", err);
    
    // Determinar el tipo de error
    let mensajeError = 'Error inesperado al procesar el certificado';
    let detalles = null;
    
    if (err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') || 
        err.message.includes('Network request failed')) {
      mensajeError = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      detalles = {
        tipo: 'conexion',
        sugerencia: 'Compruebe que su dispositivo esté conectado a internet y vuelva a intentarlo.'
      };
    } else if (err.message.includes('certificate') || 
               err.message.includes('SSL') || 
               err.message.includes('HTTPS')) {
      mensajeError = 'Error de seguridad en la conexión con el servidor.';
      detalles = {
        tipo: 'seguridad',
        sugerencia: 'Es posible que haya un problema con el certificado de seguridad del servidor.'
      };
    } else if (err.message.includes('timeout') || err.message.includes('timed out')) {
      mensajeError = 'La conexión con el servidor ha tardado demasiado tiempo.';
      detalles = {
        tipo: 'timeout',
        sugerencia: 'El servidor podría estar experimentando problemas. Intente más tarde.'
      };
    } else if (err.message.includes('CORS') || err.message.includes('Cross-Origin')) {
      mensajeError = 'Error de acceso al servidor.';
      detalles = {
        tipo: 'cors',
        sugerencia: 'Hay un problema de configuración en el servidor. Contacte al administrador.'
      };
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
        
        // Añadir timeout para la petición
        const timeoutId = setTimeout(() => {
          abortControllerRef.current.abort();
          throw new Error('La conexión con el servidor ha tardado demasiado tiempo.');
        }, 30000); // 30 segundos de timeout
        
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/pdf'
          },
          body: formData,
          signal: abortControllerRef.current.signal,
          // Asegurar que las credenciales se envían correctamente
          credentials: 'same-origin'
        });
        
        // Limpiar el timeout ya que la petición se completó
        clearTimeout(timeoutId);

        setProgreso(50);
        if (!response.ok) {
          // Manejar diferentes códigos de error HTTP
          if (response.status === 404) {
            throw new Error('El certificado solicitado no existe.');
          } else if (response.status === 403) {
            throw new Error('No tiene permisos para acceder a este certificado.');
          } else if (response.status >= 500) {
            throw new Error('Error en el servidor. Por favor, intente más tarde.');
          } else {
            const errorText = await response.text();
            throw new Error(errorText || `Error ${response.status}: No se pudo obtener el certificado`);
          }
        }

        // Verificar que la respuesta es un PDF
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
          throw new Error('La respuesta del servidor no es un PDF válido.');
        }

        const blob = await response.blob();
        setProgreso(70);
        
        // Verificar que el blob no está vacío
        if (blob.size === 0) {
          throw new Error('El servidor devolvió un documento vacío.');
        }
        
        const pdfUrl = URL.createObjectURL(blob);
        pdfUrlRef.current = pdfUrl;
        
        setProgreso(80);
        
        try {
          const pdf = await getDocument(pdfUrl).promise;
          setProgreso(90);

          if (pdf.numPages === 0) {
            throw new Error('El PDF no contiene páginas.');
          }

          setPaginas(Array.from({ length: pdf.numPages }, (_, i) => ({ pdf, numero: i + 1 })));
          setProgreso(100);
          setEstado('valido');
        } catch (pdfError) {
          console.error("Error al procesar el PDF:", pdfError);
          throw new Error('El documento recibido no es un PDF válido o está dañado.');
        }
      } catch (err) {
        // No mostrar errores si la petición fue abortada intencionalmente
        if (err.name === 'AbortError') return;
        
        // Usar la función especializada para manejar errores de red
        if (err.message.includes('Failed to fetch') || 
            err.message.includes('NetworkError') ||
            err.message.includes('certificate') ||
            err.message.includes('SSL') ||
            err.message.includes('HTTPS') ||
            err.message.includes('timeout') ||
            err.message.includes('timed out') ||
            err.message.includes('CORS') ||
            err.message.includes('Cross-Origin')) {
          manejarErrorRed(err);
        } else {
          console.error("Error al renderizar el PDF:", err);
          setEstado('invalido');
          setError(err.message || 'Error inesperado al procesar el certificado');
        }
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

  // Componente de carga mejorado
  const LoadingMessageMejorado = () => (
    <div className="loading-container">
      <div className="loading-card">
        <div className="loading-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="spinner" cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
          </svg>
        </div>
        <h3>Verificando certificado</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progreso}%` }}></div>
        </div>
        <p>
          {progreso < 20 && "Preparando solicitud..."}
          {progreso >= 20 && progreso < 50 && "Conectando con el servidor de certificaciones..."}
          {progreso >= 50 && progreso < 70 && "Descargando certificado..."}
          {progreso >= 70 && progreso < 90 && "Procesando documento..."}
          {progreso >= 90 && "Finalizando..."}
        </p>
      </div>
    </div>
  );

  // Componente de error mejorado
  const ErrorMessageMejorado = ({ mensaje, detalles }) => (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
            <path d="M12 8v5M12 16v.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3>Certificado no válido</h3>
        <p>{mensaje}</p>
        
        {detalles && (
          <div className="error-details">
            <p className="error-suggestion">{detalles.sugerencia}</p>
          </div>
        )}
        
        <div className="error-actions">
          <button className="retry-button" onClick={() => window.location.reload()}>
            Intentar nuevamente
          </button>
          
          {detalles && detalles.tipo === 'conexion' && (
            <button className="help-button" onClick={() => window.open('https://www.google.com/search?q=problemas+de+conexión+a+internet', '_blank')}>
              Ayuda con conexión
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Componente de éxito
  const SuccessHeader = () => (
    <div className="success-header">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#D1FAE5" />
          <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="success-text">
        <h2>Certificado verificado correctamente</h2>
        <p>Este documento ha sido validado por el Gobierno Autónomo Municipal de Cochabamba</p>
      </div>
    </div>
  );

  if (estado === 'validando') return <LoadingMessageMejorado />;
  if (estado === 'invalido') return <ErrorMessageMejorado mensaje={error} detalles={detallesError} />;

  return (
    <div className="certificado-container">
      <SuccessHeader />
      <div className="pdf-container">
        {paginas.map((p, index) => (
          <div key={index} className="pdf-page">
            <PDFCanvas pdf={p.pdf} numero={p.numero} />
            <div className="page-number">Página {p.numero} de {paginas.length}</div>
          </div>
        ))}
      </div>
      <div className="certificado-footer">
        <p>Fecha de verificación: {new Date().toLocaleDateString('es-ES')}</p>
        <p>Código de verificación: {codigo}</p>
      </div>
    </div>
  );
};

export default VerificarCertificadoUI;