import React from 'react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import VerificarCertificadoUI from './components/VerificarCertificado/UI/VerificarCertificadoUI';
import './App.css'; 

const AppWrapper = () => {
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('cod');

  return (
    <div className="app-container">
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