import React from 'react'
import { getDocumentByIdAction } from '@/app/_actions'
import ButtonDocumentNewVersion from '@/app/components/documents/ButtonDocumentNewVersion'
import ButtonUploadPdf from '@/app/components/documents/ButtonUploadPdf'
import Base64ToPdf from '../../../components/documents/Base64toPdf'

const info = async ({params}) => {
  const data = await getDocumentByIdAction(params.id)
  
  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-gray-50 px-4 sm:px-0 flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-semibold leading-7 text-gray-900v">
                  Información del documento
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Creado por: {data?.document?.createdBy}
                </p>
            </div>
            <div>
                <ButtonDocumentNewVersion document={data?.document}/>
            </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Nombre</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.document?.name}
            </dd>
          </div>

          <div className="px-4 py-6 flex flex-wrap items-center sm:px-0"> {/* Contenedor flexible principal */}
              <div className="flex items-center gap-2"> {/* Contenedor para el título y el nombre del PDF */}
                <dt className="text-sm font-medium leading-6 text-gray-900">Documento Funcional</dt>
                {data?.document?.pdf && (
                  <dd className="mt-1 text-sm leading-6 text-gray-700 ml-8">
                    {data?.document?.name}_V{data?.document?.version}.pdf
                  </dd>
                )}
              </div>
              
              <div className="ml-auto flex gap-2"> {/* Contenedor para los botones */}
                {data.document?.pdf && (
                  <Base64ToPdf base64Data={data.document.pdf} fileName={`Documento_Funcional_${data.document.name}`} />
                )}
                {data?.document?.status !=='obsolete' && <ButtonUploadPdf documentid={data?.document?._id}/>}
              </div>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Revisión</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.document?.dueDate}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Versión</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.document?.version}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Notificar</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.document?.notify}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Activo</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.document?.isActive ? 'SI' : 'NO'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default info