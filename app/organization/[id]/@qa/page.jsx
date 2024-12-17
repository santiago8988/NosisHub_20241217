import { getOrganizationAction } from '@/app/_actions'
import ButtonAddQA from '@/app/components/organization/ButtonAddQA'
import UserProfileImage from '@/app/components/allowedUsers/UserProfileImage'
import React from 'react'
import ButtonDeleteQA from '@/app/components/organization/ButtonDeleteQA'

const qa = async ({params}) => {
  const response=await getOrganizationAction(params.id)

  if (response.status===500 || response.status===404) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ops algo salió mal</h1>
          <p className="text-gray-600">Lo siento, no existe esa organización.</p>
        </div>
      </div>
    )
  }

  const organization=response.data

  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-gray-50 px-4 sm:px-0 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Control de Calidad
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Lista de colaboradores.
          </p>
        </div>
        <div>
            <ButtonAddQA/>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-100">
        <ul role="list" className="divide-y divide-gray-100 w-full">
          {organization && organization.qualityAssurance.map((person) => (
            <li key={person._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <UserProfileImage email={person.user.email}/>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {person.user.email}
                  </p>
                  {person.roles.map((rol)=>{
                    return(<p key={rol} className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Rol: {rol}
                    </p>)
                  })}  
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <ButtonDeleteQA qaid={person._id}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default qa