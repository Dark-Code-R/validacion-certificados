/**
 * Configuración para el componente VerificarCertificado
 */

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE || 'https://qrback.catastrocochabamba.com',
  TIMEOUT: 30000, // 30 segundos
};

// Endpoints
export const ENDPOINTS = {
  OBTENER_PDF: `${API_CONFIG.BASE_URL}/obtenerCertificacionPDF`,
};

// Mensajes de error
export const ERROR_MESSAGES = {
  CODIGO_INVALIDO: 'No se proporcionó un código válido',
  ERROR_CONEXION: 'No se pudo conectar con el servidor. Verifique su conexión a internet.',
  ERROR_SEGURIDAD: 'Error de seguridad en la conexión con el servidor.',
  ERROR_TIMEOUT: 'La conexión ha tardado demasiado tiempo.',
  ERROR_CORS: 'Error de acceso al servidor (CORS).',
  ERROR_GENERICO: 'Error inesperado al procesar el certificado',
  PDF_VACIO: 'El servidor devolvió un documento vacío.',
  PDF_INVALIDO: 'La respuesta no es un PDF válido.',
  PDF_SIN_PAGINAS: 'El PDF no contiene páginas.',
};

// Mensajes de alerta
export const ALERT_MESSAGES = {
  NO_IMPRIMIR: '🚫 No está permitido imprimir este documento.',
  NO_COPIAR: 'No está permitido copiar, descargar o imprimir este documento',
};

export default {
  API_CONFIG,
  ENDPOINTS,
  ERROR_MESSAGES,
  ALERT_MESSAGES,
};