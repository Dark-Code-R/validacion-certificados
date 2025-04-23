
# ✅ Verificador de Certificados - GAMC

Aplicación web desarrollada en React que permite verificar la validez de certificados emitidos por el Gobierno Autónomo Municipal de Cochabamba (GAMC), a través de un sistema basado en código QR. Incluye protección contra copias, animaciones, marcas de agua de alta seguridad, y soporte para múltiples entornos (desarrollo y producción).

## 📦 Características

- **Verificación segura**: Validación de certificados mediante códigos QR únicos
- **Visualización protegida**: Renderizado de certificados en formato PDF desde el backend oficial
- **Seguridad avanzada**:
  - Marcas de agua dinámicas de alta seguridad
  - Protección contra impresión, copia y capturas de pantalla
  - Patrones visuales tipo guilloche y efectos moiré
- **Experiencia de usuario mejorada**:
  - Animaciones fluidas usando anime.js
  - Interfaz responsiva para dispositivos móviles y escritorio
  - Indicadores de estado claros durante la verificación
- **Arquitectura robusta**:
  - Control de entorno mediante variables en .env
  - Separación clara de componentes UI y lógica
  - Hooks personalizados para funcionalidades específicas

## 🚀 Instalación

### Prerrequisitos

- Node.js (v14.x o superior)
- npm (v6.x o superior)

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone [URL_DEL_REPOSITORIO]
cd verificador-certificados
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=8010
REACT_APP_API_BASE=[URL_BASE_API]
```

> **Nota**: Ajusta `REACT_APP_API_BASE` según el entorno (producción/desarrollo).

## 💻 Uso

### Desarrollo local

```bash
npm start
```

La aplicación estará disponible en [http://localhost:8010](http://localhost:8010)

## 🛠️ Tecnologías utilizadas

- [React](https://reactjs.org/) - Framework de UI
- [PDF.js](https://mozilla.github.io/pdf.js/) - Renderizado de PDFs
- [anime.js](https://animejs.com/) - Animaciones
- [React Router](https://reactrouter.com/) - Enrutamiento

## 📋 Estructura del proyecto

```
verificador-certificados/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/          # Componentes React
│   │   ├── VerificarCertificado/  # Componente principal
│   │   │   ├── UI/          # Componentes de interfaz
│   │   │   └── hooks/       # Hooks personalizados
│   ├── assets/              # Imágenes y recursos
│   ├── utils/               # Utilidades y helpers
│   ├── App.jsx              # Componente raíz
│   └── index.js             # Punto de entrada
├── .env                     # Variables de entorno
└── README.md                # Este archivo
```

## 👥 Equipo

- **Desarrollo Frontend**: Rodrigo Dyker (Pasante de Desarrollo)
- **Supervisión**: Equipo de Desarrollo GAMC
- **Diseño**: Departamento de Diseño GAMC
- **Contacto**: rodrigo.darkcode (at) gmail.com

## 📄 Licencia

Este proyecto es propiedad del Gobierno Autónomo Municipal de Cochabamba. Todos los derechos reservados.

