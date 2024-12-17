import { getOrganizationAction } from '@/app/_actions'
import Image from 'next/image'

const UserProfileCard = async({ user }) => {

  const organization = await getOrganizationAction(user?.organization)

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <Image
            src={user?.image || '/placeholder.svg?height=100&width=100'}
            alt={user?.name || 'User'}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">ID</h3>
            <p className="mt-1 text-sm text-gray-900">{user?.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Rol</h3>
            <p className="mt-1 text-sm text-gray-900">{user?.role}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Area</h3>
            <p className="mt-1 text-sm text-gray-900">{user?.area}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase">Organización</h3>
            <p className="mt-1 text-sm text-gray-900">{organization?.data?.name}</p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Puestos</h3>
            <p className="mt-1 text-sm text-gray-900">{user.position.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard