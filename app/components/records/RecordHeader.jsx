import { BarChart, Calendar, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

const RecordHeader = ({ entries, isActive }) => {

  const countComplete = () => {
    let counter = 0;
    entries.forEach(entry => {
      if (entry.completed) {
        counter++;
      }
    });
    return counter;
  }

  return isActive ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total entradas</CardTitle>
          <BarChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entries?.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Completados</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{countComplete()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Próximos a vencer</CardTitle>
          <Calendar className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entries?.length - countComplete()}</div>
        </CardContent>
      </Card>
    </div>
  ) : (
    < div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Estado del registro</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-red-500">Inactivo</div>
        </CardContent>
        </Card>
    </div>
  );
}

export default RecordHeader



/*import { BarChart ,Calendar,CheckCircle} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

const RecordHeader = ({entries,isActive}) => {

    const countComplete=()=>{
        let counter=0;
        const complete=entries.map(entry=>{
            if(entry.completed){
                counter++
            }
        })
        return counter;
    }

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total entradas</CardTitle>
                <BarChart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{entries?.length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Completados</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{countComplete()}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Próximos a vencer</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{entries?.length-countComplete()}</div>
            </CardContent>
        </Card>
    </div>
  )
}

export default RecordHeader*/