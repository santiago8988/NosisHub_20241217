import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { FileText, Users,BarChart,Calendar,CheckCircle } from 'lucide-react'
import { getDocumentToReviewAction, getOrganizationAction } from '@/app/_actions'

const page = async () => {
  const session = await getServerSession(authOptions)
  const documents=await getDocumentToReviewAction(session?.user?.organization)
  const organization = await getOrganizationAction(session?.user?.organization)

  const checkQA = (qualityAssurance) => {
    return qualityAssurance?.some(qaUser => qaUser.email === session?.user?.email) ?? false;
  }
  
  const isAdmin = session?.user?.role === 'admin'
  const isQA = checkQA(organization?.data?.qualityAssurance)
  

  if (!isAdmin && !isQA) {
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
  const daysToDueDate=(dueDate)=>{
    const currentDate = new Date();
    const entryDueDate = new Date(dueDate);
    const timeDiff = entryDueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff
  }

  const NextToDueDate=()=>{

    let counter=0;
    documents.documents.map(document=>{
      if(daysToDueDate(document.dueDat)<=30 && daysToDueDate(document.dueDat)>=0){
        counter++;
      }
    })
    return counter;
  }

  const defeated=()=>{

    let counter=0;
    documents.documents.map(document=>{
      if(daysToDueDate(document.dueDat)<0){
        counter++;
      }
    })
    return counter;
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white p-5">

    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Documentos</h1>
        <div className="flex items-center">
          <Input className="mr-2" placeholder="Buscar entradas..." />
          <Button>{/*<Search className="h-4 w-4 mr-2" />*/} Buscar</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <BarChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos a revisar</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{NextToDueDate()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defeated()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Entries table */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos por revisar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.documents?.map((document) => (
                <TableRow key={document._id}>
                  <TableCell className="font-medium">{document._id}</TableCell>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>{document.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={daysToDueDate(document.dueDate) <= 30 ? "destructive" : "default"}>
                      {daysToDueDate(document.dueDate)<0 ? 'Vencida' : `${daysToDueDate(document.dueDate)} días`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                   <Link href={`/document/${document._id}`}><Button variant="outline" size="sm">Revisar</Button></Link>        
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
</main>
  )
}

export default page