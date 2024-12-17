"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, Text, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@uiw/react-textarea-code-editor'), { ssr: false });

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});



const initialStyles ={
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
}

const AverPDF = ({ initialContent }) => {
  const [content, setContent] = useState(JSON.stringify(initialContent, null, 2));
  const [contentJSON,setContentJSON]=useState({})
  const [styles, setStyles] = useState(JSON.stringify(initialStyles, null, 2));
  const [contentError, setContentError] = useState(null);
  const [stylesError, setStylesError] = useState(null);

  const renderImage = (base64String) => {
    if (!base64String) return null;
    
    // Check if the base64String already includes the data URI scheme
    if (base64String.startsWith('data:')) {
      return base64String;
    }
    
    // If it doesn't, add the data URI scheme
    return `data:image/jpeg;base64,${base64String}`;
  };

  const processContentImages = (content) => {
    let processedContent = [];
    
    if (content) {
      // Mapeamos los párrafos del contenido
      processedContent = content.map(paragraph => ({
        ...paragraph, // Mantenemos el resto de las propiedades del párrafo
        image: paragraph.image !== null ? "SI" : null // Cambiamos el valor de la imagen
      }));
    }
  
    return processedContent;
  };
  

  // Efecto para procesar el contenido y almacenarlo en contentJSON
  useEffect(() => {
    if(initialContent){
      const updatedContent = processContentImages(initialContent.paragraphs);
      setContentJSON(JSON.stringify(updatedContent, null, 2));
    }
  }, [initialContent]);

  const validateContent = useCallback((newContent) => {
    try {
      JSON.parse(newContent);
      setContentError(null);
    } catch (err) {
      setContentError(`JSON Error: ${err.message}`);
    }
  }, []);

  const validateStyles = useCallback((newStyles) => {
    try {
      new Function(`return ${newStyles}`)();
      setStylesError(null);
    } catch (err) {
      setStylesError(`JavaScript Error: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    validateContent(content);
    validateStyles(styles);
  }, [content, styles, validateContent, validateStyles]);

  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleStylesChange = useCallback((newStyles) => {
    setStyles(newStyles);
  }, []);

  const PDFDocument = useCallback(() => {
    if (contentError || stylesError) {
      return (
        <Document>
          <Page size="A4">
            <Text>{contentError || stylesError}</Text>
          </Page>
        </Document>
      );
    }

    try {
      const parsedContent = JSON.parse(content); // parsedContent es un objeto con title y paragraphs
      const parsedStyles = new Function(`return ${styles}`)();
      const styleSheet = StyleSheet.create(parsedStyles);

      return (
        <Document>
          <Page size="A4" style={styleSheet.body}>
            {/* Título del documento */}
            <Text style={styleSheet.title}>{parsedContent.title}</Text>

            {/* Iterar sobre los párrafos */}
            {parsedContent.paragraphs && parsedContent.paragraphs.map((item, index) => (
              <React.Fragment key={index}>
                <Text style={styleSheet.subtitle}>{item.title}</Text>
                <Text style={styleSheet.text}>{item.body}</Text>
                {item.image && <Image src={renderImage(item.image)} style={styleSheet.image} alt={`Imagen del párrafo ${index + 1}`}/>}
              </React.Fragment>
            ))}
            <Text 
              style={styleSheet.pageNumber} 
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
              fixed 
            />
          </Page>
        </Document>
      );
    } catch (err) {
      return (
        <Document>
          <Page size="A4">
            <Text>{`Error rendering PDF: ${err.message}`}</Text>
          </Page>
        </Document>
      );
    }
  }, [content, styles, contentError, stylesError]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden mb-4">
            <h2 className="text-lg font-bold mb-2">Content (JSON)</h2>
            <div className="flex-1 overflow-auto">
              <CodeEditor
                value={contentJSON}
                language="json"
                onChange={(evn) => handleContentChange(evn.target.value)}
                padding={15}
                style={{
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  height: '100%',
                  minHeight: '200px',
                  overflow: 'auto'
                }}
              />
            </div>
            {contentError && <div className="text-red-500 mt-2">{contentError}</div>}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <h2 className="text-lg font-bold mb-2">Styles (JavaScript Object)</h2>
            <div className="flex-1 overflow-auto">
              <CodeEditor
                value={styles}
                language="javascript"
                onChange={(evn) => handleStylesChange(evn.target.value)}
                padding={15}
                style={{
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  height: '100%',
                  minHeight: '200px',
                  overflow: 'auto',
                }}
              />
            </div>
            {stylesError && <div className="text-red-500 mt-2">{stylesError}</div>}
          </div>
        </div>
        <div className="w-1/2 p-4 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold mb-2">PDF Preview</h2>
          <div className="flex-1 overflow-auto">
            <PDFViewer width="100%" height="100%">
              <PDFDocument />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverPDF;
