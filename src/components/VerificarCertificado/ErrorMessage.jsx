const ErrorMessage = ({ mensaje }) => (
    <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>
      <h3>Certificado inválido</h3>
      <p>{mensaje}</p>
    </div>
  );
  export default ErrorMessage;
  