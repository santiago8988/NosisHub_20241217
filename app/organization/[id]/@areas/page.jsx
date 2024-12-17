import { getOrganizationAction } from '@/app/_actions'
import React from 'react'
import UserProfileImage from '@/app/components/allowedUsers/UserProfileImage'
import UsersAvatars from '@/app/components/UsersAvatars'
import ButtonAddArea from '@/app/components/organization/ButtonAddArea'
import DeleteAreaButton from '@/app/components/organization/DeleteAreaButton'

const areas = async ({params}) => {
  const organization=await getOrganizationAction(params.id)


  if (organization.status===500 || organization.status===404) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ops algo salió mal</h1>
          <p className="text-gray-600">Lo siento, no existe esa organización.</p>
        </div>
      </div>
    )
  }
  
  const areas=organization?.data?.areas

  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-gray-50 px-4 sm:px-0 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            AREAS
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Lista de areas.
          </p>
        </div>
        <div>
            <ButtonAddArea/>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-100">
        <ul role="list" className="divide-y divide-gray-100 w-full">
          {areas.map((area) => (
            <li key={area._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {area.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                     Lider {area.areaLeader}
                  </p>
                </div>
                <div className="flex -space-x-1 overflow-hidden">
                      <UserProfileImage email={area.areaLeader}/>
                      <UsersAvatars userList={area.collaborators}/>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <DeleteAreaButton areaid={area._id} areaName={area.name}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default areas