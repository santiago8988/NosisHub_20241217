
import { getDocumentByIdAction } from '@/app/_actions'
import ButtonAddContent from '@/app/components/documents/ButtonAddContent'
import ButtonEditContent from '@/app/components/documents/ButtonEditContent'
import ButtonDeleteParagraph from '@/app/components/documents/ButtonDeleteParagraph'
import ContentTable from '@/app/components/documents/ContentTable'
import ButtonViewPdf from '@/app/components/documents/Pdf/ButtonViewPdf'

const content = async  ({params}) => {

  const document = await getDocumentByIdAction(params.id)


  return (
    <>
        
        {/*<div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div className="flex justify-between items-center mb-2"> 
                <h2 className="text-2xl font-semibold leading-tight">Párrafos</h2>
                <ButtonAddContent document={document.document}/>
              </div>

              <p className="text-gray-600 mb-4">
                Personalice los párrafos y títulos de su Documento.
              </p>

                  <div className="overflow-x-auto mt-10">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-5 py-3   border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3   border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold"
                          >
                            Agregado por
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-bold"
                          >
                            Imagen
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3  border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                          >
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3  border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                          >
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {document.document.content.map((paragraph,index) => (
                          <tr key={paragraph._id}>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                              <div className="flex items-center">
                                <div className="ml-3">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {index+1}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200  text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{paragraph.title}</p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {paragraph.addedBy}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                <span className="relative">{paragraph.image ? 'SI' : 'NO'}</span>
                              </span>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm text-right">
                                  <ButtonEditContent document={document.document} paragraph={paragraph}/>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 text-sm text-right">
                                  <ButtonDeleteParagraph paragraphid={paragraph._id} documentid={document?.document?._id}/>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            </div>
          </div>*/}
          <section className="flex-1 overflow-y-auto bg-white p-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">Párrafos</h1>
                <div className="flex items-center">
                    <ButtonAddContent document={document.document}/>
                    <ButtonViewPdf documentid={params.id}/>
                </div>
            </div>
            <ContentTable document={document}/>
          </section>
    </>
  )
}

export default content