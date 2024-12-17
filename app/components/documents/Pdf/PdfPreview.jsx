'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PDFDownloadLink, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { ErrorBoundary } from 'react-error-boundary';
import * as Babel from '@babel/standalone';

function PdfPreview({ code }) {
  const [error, setError] = useState(null);
  const [PdfComponent, setPdfComponent] = useState(null);
  const componentInstanceRef = useRef(null);

  useEffect(() => {
    setError(null);

    try {
      // Transpile JSX code
      const { code: transpiledCode } = Babel.transform(code, {
        presets: ['es2015', 'react'],
      });

      // Create a functional component
      const Component = eval(transpiledCode);

      // Wrap the component in PdfPageContent and memoize it
      const PdfPageContent = React.memo(({ contentRef }) => {
        return <>{contentRef.current}</>; 
      });

      // Create a new function component that uses PdfPageContent
      const NewPdfComponent = () => (
        <Document>
          <Page>
            <PdfPageContent contentRef={componentInstanceRef} />
          </Page>
        </Document>
      );

      // Set the component in the state
      setPdfComponent(() => NewPdfComponent);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [code]); // The useEffect runs every time 'code' changes

  useEffect(() => {
    if (PdfComponent) {
      // Evaluate the component
      const instance = <PdfComponent />;
      componentInstanceRef.current = instance;
    }
  }, [PdfComponent]);

  const ErrorFallback = ({ error }) => (
    <div className="text-red-500">
      Error rendering PDF: {error.message}
    </div>
  );

  return (
    <div className="w-full md:w-1/2 p-4">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(e) => setError(e.message)}
      >
        {error ? (
          <ErrorFallback error={new Error(error)} />
        ) : PdfComponent ? (
          <PDFDownloadLink document={<PdfComponent />} fileName="document.pdf">
            {({ loading }) =>
              loading ? 'Generating document...' : 'Download PDF'
            }
          </PDFDownloadLink>
        ) : null}
      </ErrorBoundary>
    </div>
  );
};

PdfPreview.displayName = 'PdfPreview';

export default PdfPreview;



/*'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PDFDownloadLink, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { ErrorBoundary } from 'react-error-boundary';
import * as Babel from '@babel/standalone';

const PdfPreview = ({ code }) => {
  const [error, setError] = useState(null);
  const [PdfComponent, setPdfComponent] = useState(null);
  const componentInstanceRef = useRef(null);

  useEffect(() => {
    setError(null);

    try {
      // Transpilamos el código JSX
      const { code: transpiledCode } = Babel.transform(code, {
        presets: ['es2015', 'react'],
      });

      // En lugar de new Function, creamos un componente funcional
      const Component = eval(transpiledCode);

      // Envolvemos el componente en PdfPageContent y lo memorizamos
      const PdfPageContent = React.memo(({ contentRef }) => {
        return <>{contentRef.current}</>; 
      });

      // Creamos una nueva función componente que usa PdfPageContent
      const NewPdfComponent = () => (
        <Document>
          <Page>
            <PdfPageContent contentRef={componentInstanceRef} />
          </Page>
        </Document>
      );

      // Establecemos el componente en el estado
      setPdfComponent(() => NewPdfComponent);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [code]); // El useEffect se ejecuta cada vez que 'code' cambia

  useEffect(() => {
    if (PdfComponent) {
      // Evaluamos el componente
      const instance = <PdfComponent />;
      componentInstanceRef.current = instance;
    }
  }, [PdfComponent]);

  const ErrorFallback = ({ error }) => (
    <div className="text-red-500">
      Error al renderizar el PDF: {error.message}
    </div>
  );

  return (
    <div className="w-full md:w-1/2 p-4">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(e) => setError(e.message)}
      >
        {error ? (
          <ErrorFallback error={new Error(error)} />
        ) : PdfComponent ? (
          <PDFDownloadLink document={<PdfComponent />} fileName="documento.pdf">
            {({ loading }) =>
              loading ? 'Generando documento...' : 'Descargar PDF'
            }
          </PDFDownloadLink>
        ) : null}
      </ErrorBoundary>
    </div>
  );
};

export default PdfPreview*/
