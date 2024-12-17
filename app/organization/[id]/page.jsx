import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllowedUsersAction, getOrganizationAction } from "@/app/_actions"
import Link from 'next/link'

const Page = async ({ params }) => {
  const session = await getServerSession(authOptions)
  const organization = await getOrganizationAction(params.id)
  const allowedUsers = await getAllowedUsersAction(params.id)

 

  if (organization.status===500 || organization.status===404) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ups algo salió mal.</h1>
          <p className="text-gray-600">Lo siento, no existe esa organización.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  const hasAccess = session?.user?.organization === params.id

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Lo siento, no tienes acceso a esta organización.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  const hasPermision = session?.user?.role==='admin'

  if (!hasPermision) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Lo siento, no posee los permisos para ingresar a la sección.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }


  return (
    <div className="text-center">
      <h1 className="text-4xl">{organization.name}</h1>
      <p className="text-xs mt-2">{organization.organizationEmail}</p>
    </div>
  )
}

export default Page