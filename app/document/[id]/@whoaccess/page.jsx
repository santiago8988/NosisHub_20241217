import React from 'react'
import { getDocumentByIdAction } from '@/app/_actions'
import ButtonAddAccess from '@/app/components/documents/ButtonAddAccess'
import ButtonDeleteAccess from '@/app/components/documents/ButtonDeleteAccess'
const whoaccess = async ({params}) => {

  const document = await getDocumentByIdAction(params.id)
 
  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-gray-50 px-4 sm:px-0 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold leading-7 text-gray-900">
            Acceso al documento
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Lista de puestos.
          </p>
        </div>
        <div>
          <ButtonAddAccess document={document.document}/>
        </div>
      </div>
      <div className="mt-5 border-t border-gray-100">
        <ul role="list" className="divide-y divide-gray-100 w-full">
          {document && document?.document?.access?.map((rol) => (
            <li key={rol.role._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                {/*<UserProfileImage email={person.email}/>*/}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {rol.role.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {rol.permissionLevel==='admin' ? 'Permisos: Todos' : (rol.permissionLevel==='write' ? 'Permisos: Editor': 'Permisos: Lectura')}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <ButtonDeleteAccess roleid={rol.role._id} documentid={document.document._id}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default whoaccess