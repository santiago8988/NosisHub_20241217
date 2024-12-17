import { getAllowedUsersAction, getOrganizationAction } from '@/app/_actions';
import AllowedUsersTable from '@/app/components/organization/AllowedUsersTable';
import ButtonAddUser from '@/app/components/organization/ButtonAddUser';
import ButtonUserStatus from '@/app/components/organization/ButtonUserStatus';
import organization from '../../page';

const allowedusers = async ({params}) => {

  const allowedUsers=await getAllowedUsersAction(params.id)
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
  const organization=await response.data
  return (
    <>
      <section className="flex-1 overflow-y-auto bg-white p-5">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Lista</h1>
            <div className="flex items-center">
              <ButtonAddUser areas={organization.areas} positions={organization.roles}/>
            </div>
        </div>
        <AllowedUsersTable allowedUsers={allowedUsers}/>
      </section>
    </>
  )
}

export default allowedusers