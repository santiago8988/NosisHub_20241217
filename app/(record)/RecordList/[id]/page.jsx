import { getEntriesByRecordIdAction, getRecordByIdAction } from "@/app/_actions"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import RecordHeader from "@/app/components/records/RecordHeader"
import { getServerSession } from "next-auth"
import Link from "next/link"

const Record = async ({params}) => {

  const session=await getServerSession(authOptions)
  const data = await getRecordByIdAction(params.id)
  const entries=await getEntriesByRecordIdAction(params.id)

  if (data.status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ups algo salió mal.</h1>
          <p className="text-gray-600">El registro no existe.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  const checkAccess = (recordOwner, recordCollaborators) => {
    const currentUserId = session?.user?.id;
  
    if (recordOwner && currentUserId === recordOwner._id) {
      return true;
    }
    if (Array.isArray(recordCollaborators)) {
      return recordCollaborators.some(collaborator => collaborator._id === currentUserId);
    }
    return false;
  };


  const isOrganization= session?.user?.organization === data?.record?.organization
  const hasAccess=checkAccess(data?.record?.createdBy,data?.record?.collaborators)
  const isAdmin = session?.user?.role === 'admin'

  if (!isOrganization && ( !hasAccess || !isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado.</h1>
          <p className="text-gray-600">Lo siento, no tiene permisos para ingresar a esta sección.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }
 
  return (
    
    <>
      <h1 className="text-3xl font-bold mb-6">{data?.record?.name} <span className="text-sm">V:{data?.record?.version}</span></h1>
      <RecordHeader entries={entries} isActive={data?.record?.isActive}/>
    </>
  )
}

export default Record