import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { v4 as uuid } from "uuid"
import { Suspense } from "react"
import Search from "../search"
import Skeleton from "../skeleton"
import Await from "../await"
import List from "@/app/components/records/RecordList"
import {Button} from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { BarChart ,Calendar,CheckCircle} from 'lucide-react'
import { getOrganizationAction, getRecordsObsoleteByUserEmailAction, getRecordsObsoleteByUserEmailAction2 } from "@/app/_actions"
import { convertToPlainObject } from "@/lib/utils/utils"
import Pagination from "@/app/components/documents/Pagination"

const obsolete = async ({searchParams}) => {
  
  const session = await getServerSession(authOptions)
  const recordList = await getRecordsObsoleteByUserEmailAction(session?.user?.email)

   const organization = await getOrganizationAction()
   const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
   const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 12
   const search = typeof searchParams.search === 'string' ? searchParams.search : undefined


   const promise = getRecordsObsoleteByUserEmailAction2(session?.user?.id,search,page,limit)

  return (

    <section className='flex-1 overflow-y-auto bg-white p-5' key={uuid()}>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Registros Obsoletos</h1>
            <div className="flex items-center">
              <Search search={search} className="h-4 w-4 mr-2"/>
              <Button className='ml-2'> Buscar</Button>
            </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total registros</CardTitle>
                <BarChart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recordList?.records?.length}</div>
              </CardContent>
            </Card>
            {/*<Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos a vencer</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completados hoy</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>*/}
         </div>
         <Suspense fallback={<Skeleton/>}>
            <Await promise={promise}>
                  {({recordList})=> <List recordList={convertToPlainObject(recordList)}/>}
            </Await>
        </Suspense>
        <Pagination
          currentPage={page}
          totalItems={recordList?.records?.length}
          itemsPerPage={limit}
        />
      
  </section>
  )
}

export default obsolete