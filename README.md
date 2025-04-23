
# ✅ Verificador de Certificados - Sistema QR

![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

Aplicación web desarrollada en React que permite verificar la validez de certificados a través de un sistema basado en código QR. Incluye protección contra copias, animaciones, marcas de agua de alta seguridad, y soporte para múltiples entornos (desarrollo y producción).

Este proyecto fue desarrollado por mí como parte de mi experiencia profesional en desarrollo frontend, implementando soluciones de seguridad avanzadas para documentos digitales.

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
git clone https://github.com/Dark-Code-R/verificador-certificados.git
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
REACT_APP_API_BASE=https://tu-api-backend.com
```

> **Nota**: Ajusta `REACT_APP_API_BASE` según tu entorno (producción/desarrollo).

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

## 👤 Autor

- **Carlos Rodrigo Condori R.** - Desarrollador Frontend
- **Contacto**: rodrigo.darkcode@gmail.com
- **GitHub**: [Dark-Code-R](https://github.com/Dark-Code-R)
- **LinkedIn**: [Carlos Rodrigo Condori R.](https://www.linkedin.com/in/carlos-rodrigo-condori-r-1377aa339/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

Desarrollado con ❤️ por Carlos Rodrigo Condori R. (Dark-Code-R)
