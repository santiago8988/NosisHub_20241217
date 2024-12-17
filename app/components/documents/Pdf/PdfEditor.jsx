"use client";
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const PdfEditor = ({code,onChange}) => {


  return (
    <div className="w-full md:w-1/2 p-4">
      <CodeMirror
        value={code}
        height="80vh"
        extensions={[javascript({ jsx: true })]} // Soporte para JSX
        onChange={onChange}
      />
      {/* Opcional: Botón para forzar la actualización en PdfPreview */}
    </div>
  );
};

export default PdfEditor;
