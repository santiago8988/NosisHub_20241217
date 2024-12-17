import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
import EntradasChart from '@/components/admin/EntradasChart'
import RegistrosTable from '@/components/admin/RegistrosTable'
import ErrorBoundary from '@/components/admin/ErrorBoundary'
import { getEntriesByOrganizationAdminAction } from '@/app/_actions'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session?.user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h1>
          <p className="text-gray-600">Lo siento, no tiene permisos para ingresar a esta sección.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  const { data, vencidas, agrupadas } = await getEntriesByOrganizationAdminAction(session?.user?.organization)

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Resumen de Entradas</h2>
          <EntradasChart 
            vencidas={vencidas}
            enProceso={data?.entries?.length - vencidas}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Registros y Entradas por Vencer</h2>
          <RegistrosTable registros={agrupadas} />
        </div>
      </div>
    </ErrorBoundary>
  )
}



/*import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
import EntradasChart from '@/components/admin/EntradasChart'
import RegistrosTable from '@/components/admin/RegistrosTable'
import ErrorBoundary from '@/components/admin/ErrorBoundary'
import { getEntriesByOrganizationAdminAction } from '@/app/_actions'



export default async function AdminPage() {
  try {
    const session = await getServerSession(authOptions)

    const isAdmin = session?.user?.role === 'admin'

    if (!isAdmin) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h1>
            <p className="text-gray-600">Lo siento, no tiene permisos para ingresar a esta sección.</p>
          </div>
          <Link href="/inicio" className="text-blue-600 hover:underline">
            Volver a Inicio
          </Link>
        </div>
      )
    }
    const {data,vencidas,agrupadas}=await getEntriesByOrganizationAdminAction(session?.user?.organization)

    
    return (
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Resumen de Entradas</h2>
            <EntradasChart 
              vencidas={vencidas}
              enProceso={data?.entries?.length-vencidas}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Registros y Entradas por Vencer</h2>
            <RegistrosTable registros={agrupadas} />
          </div>
        </div>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Error en AdminPage:', error)
    return <div>Error: No se pudo cargar la página de administración</div>
  }
}*/