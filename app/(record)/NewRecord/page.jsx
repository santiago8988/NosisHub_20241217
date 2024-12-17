import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import NewRecordForm from "@/app/components/records/NewRecordForm"
import Link from "next/link"


const NewRecord = async () => {

  const session = await getServerSession(authOptions)


  const isAdmin= session?.user?.role==='admin'

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
 
  return (
    <section className='py-2'>
      <div className='container'>
          <div className='container'>
            <h1 className='text-3xl font-bold'>Formulario de Creación</h1>
            <NewRecordForm initialRecord={null}/>
          </div>
      </div>
    </section>
  )
}

export default NewRecord