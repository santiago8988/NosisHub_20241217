import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getEntriesByUserAction } from "../_actions"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { BarChart,Calendar,CheckCircle } from 'lucide-react'



const page = async () => {
    const session = await getServerSession(authOptions)
    const {entries,newEntries} = await getEntriesByUserAction(session?.user?.id)

    const daysToDueDate=(dueDate)=>{
      const currentDate = new Date();
      const entryDueDate = new Date(dueDate);
      const timeDiff = entryDueDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff
    }

    const NextToDueDate=()=>{

      let counter=0;
      entries.map(entry=>{
        if(daysToDueDate(entry.dueDate)<=7 && daysToDueDate(entry.dueDate)>=0){
          counter++;
        }
      })
      return counter;
    }

    const defeated=()=>{

      let counter=0;
      entries.map(entry=>{
        if(daysToDueDate(entry.dueDate)<0){
          counter++;
        }
      })
      return counter;
    }

  return (
    <main className="flex-1 overflow-y-auto bg-white p-5">

        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Entradas</h1>
            <div className="flex items-center">
              <Input className="mr-2" placeholder="Buscar entradas..." />
              <Button>{/*<Search className="h-4 w-4 mr-2" />*/} Buscar</Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
                <BarChart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entries.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos a vencer</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{NextToDueDate()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
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
              <CardTitle>Entradas por vencer</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-medium">{entry._id}</TableCell>
                      <TableCell>{entry.record.name}</TableCell>
                      <TableCell>{entry.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={daysToDueDate(entry.dueDate) <= 7 ? "destructive" : "default"}>
                          {daysToDueDate(entry.dueDate)<0 ? 'Vencida' : `${daysToDueDate(entry.dueDate)} días`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                       <Link href={`/entrie/${entry._id}`}><Button variant="outline" size="sm">Completar</Button></Link>        
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