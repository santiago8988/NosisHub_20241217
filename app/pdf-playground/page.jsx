import PDFPlaygroundComponent from "../components/documents/Pdf/PDFPlaygroundComponent"
import { getDocumentByIdAction } from '@/app/_actions'

const page = async ({ searchParams }) => {
  const documentId = searchParams.data;

  // Estado inicial para el documento y posibles errores
  let document = null;
  let error = null;

  // Si no hay `documentId` o es inválido
  if (!documentId) {
    error = 'No se proporcionó un ID de documento válido.';
  } else {
    try {
      // Intentamos obtener el documento
      document = await getDocumentByIdAction(documentId);
      console.log(document)

      // Si no se encontró el documento
      if (document.status!==200) {
        error = 'El documento no existe o no se puede encontrar.';
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      error = 'Hubo un error al intentar cargar el documento.';
    }
  }

  // Renderizado condicional basado en si hay error o no
  return (
    <>
      {error ? (
        <div>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      ) : (
        <PDFPlaygroundComponent document={document?.document} />
      )}
    </>
  );
};

export default page;
