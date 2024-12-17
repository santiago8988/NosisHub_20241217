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
        className={`
          inline-flex items-center p-2
          text-blue-500 font-bold rounded 
          ${downloadTriggered ? 'opacity-50 cursor-not-allowed' : ''} 
        `}
        onClick={downloadPDF}
        disabled={downloadTriggered}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5" // Puedes ajustar el tamaño aquí
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    </button>
      );
};

export default Base64ToPdf;
