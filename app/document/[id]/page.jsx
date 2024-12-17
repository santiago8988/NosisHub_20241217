import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
import { getDocumentByIdAction, getHistoryByDocumentIdAction, getOrganizationAction } from '@/app/_actions'
import ButtonArchive from '@/app/components/documents/ButtonArchive'
import ButtonHistory from '@/app/components/documents/ButtonHistory'
import ButtonNextStatus from '@/app/components/documents/ButtonNextStatus'
import ButtonPrevStatus from '@/app/components/documents/ButtonPrevStatus'
import ProgressBar from '@/app/components/documents/ProgressBar'

export default async function DocumentPage({ params }) {
  const session = await getServerSession(authOptions)
  const organization = await getOrganizationAction(session?.user?.organization)
  const document = await getDocumentByIdAction(params.id)
  const history = await getHistoryByDocumentIdAction(params.id)

  if (document?.status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ups algo salió mal.</h1>
          <p className="text-gray-600">El documento no existe.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  const checkQA = (qualityAssurance) => {
    return qualityAssurance?.some(qaUser => 
      qaUser.user.email === session?.user?.email && 
      qaUser.roles.some(role => ['revisar', 'aprobar', 'publicar'].includes(role))
    ) ?? false;
  }

  const checkAccess = (documentAccess) => {
    return documentAccess?.some(position => 
      session?.user?.position.includes(position.name)
    );
  }

  const getUserRoles = (qualityAssurance) => {
    const userQA = qualityAssurance?.find(qaUser => qaUser.user.email === session?.user?.email);
    return userQA ? userQA.roles : [];
  }

  const isOrganization = session?.user?.organization === document?.document?.organization
  const isAdmin = session?.user?.role === 'admin'
  const isQA = checkQA(organization?.data?.qualityAssurance)
  const hasAccess = checkAccess(document?.document?.access)
  const userRoles = getUserRoles(organization?.data?.qualityAssurance)

  if (!isOrganization && !isAdmin && !isQA && !hasAccess) {
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

  const canChangeStatus = (status, direction) => {
    const statusFlow = ['draft', 'created', 'reviewed', 'approved', 'published', 'obsolete'];
    const currentIndex = statusFlow.indexOf(status);
    
    if (direction === 'next') {
      if (status === 'draft') {
        return session?.user?.email === document.document.createdBy;
      }
      if (status === 'created' && userRoles.includes('revisar')) return true;
      if (status === 'reviewed' && userRoles.includes('aprobar')) return true;
      if (status === 'approved' && userRoles.includes('publicar')) return true;
    } else if (direction === 'prev') {
      if (status === 'created' && session?.user?.email === document.document.createdBy) return true;
      if (status === 'reviewed' && userRoles.includes('revisar')) return true;
      if (status === 'approved' && userRoles.includes('aprobar')) return true;
    }

    return isAdmin; // Admins can always change status
  }

  const renderActionButtons = () => {
    const status = document.document.status;
    
    if (['obsolete', 'published'].includes(status)) {
      return status === 'published' ? <ButtonArchive documentid={document.document._id}/> : null;
    }

    return (
      <>
        {status !== 'draft' && canChangeStatus(status, 'prev') && 
          <ButtonPrevStatus documentid={document.document._id} currentStep={status} />}
        {status !== 'published' && canChangeStatus(status, 'next') && 
          <ButtonNextStatus documentid={document.document._id} currentStep={status} />}
      </>
    );
  }

  return (
    <div className="container mx-auto p-5"> 
      <h1 className="text-3xl font-bold text-center mb-4">{document.document.name}</h1> 
      <ProgressBar currentStep={document.document.status} />
      <div className="flex justify-center mt-8 gap-2"> 
        {renderActionButtons()}
      </div>
      <div className="flex justify-center mt-8 gap-2">
        <ButtonHistory documentid={document.document._id} history={history.data} status={document.document.status}/>
      </div>
    </div>
  )
}