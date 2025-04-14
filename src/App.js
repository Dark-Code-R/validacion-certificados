import React from 'react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import VerificarCertificadoUI from './components/VerificarCertificado/UI/VerificarCertificadoUI';
import './App.css'; // Asegúrate de crear este archivo CSS
import banner from './assets/images/banner.png';

const AppWrapper = () => {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('cod');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img 
            src={banner}
            alt="Logo Gobierno Autónomo Municipal de Cochabamba" 
            className="app-logo"
          />
        </div>
        <h1 className="app-title">
          <span className="title-main">Verificador de Certificados</span>
          <span className="title-sub">Gobierno Autónomo Municipal de Cochabamba</span>
        </h1>
      </header>
      <main className="app-content">
        <VerificarCertificadoUI codigo={codigo} />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Gobierno Autónomo Municipal de Cochabamba - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
export default App;