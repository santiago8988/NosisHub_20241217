"use client"
import { useState,useEffect } from 'react';

const Base64ToPdf = ({ base64Data, fileName }) => {
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const downloadPDF = () => {
    if (!base64Data) {
      console.error('El string base64 está vacío.');
      return;
    }
    const base64String = base64Data.split(',')[1];
    // Convertir base64 a blob
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crear una URL para el blob
    const url = URL.createObjectURL(blob);

    // Abrir una nueva ventana para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'documento.pdf';
    a.click();

    // Limpiar la URL creada
    URL.revokeObjectURL(url);

    // Indicar que la descarga ha sido activada
    setDownloadTriggered(true);
  };

  // Resetear el estado si downloadTriggered cambia
  useEffect(() => {
    if (downloadTriggered) {
      setDownloadTriggered(false);
    }
  }, [downloadTriggered]);

  // Renderizar el botón que activa la descarga
  return (
    <button
      className={`border border-primary text-primary text-sm px-3 py-1 rounded hover:bg-primary hover:text-white disabled:opacity-50 flex items-center`}
      onClick={downloadPDF}
      disabled={downloadTriggered}
    >
      <i className="nav-icon fe fe-download me-2 text-center"></i>
    </button>
  );
};

export default Base64ToPdf;
