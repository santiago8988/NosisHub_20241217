
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { v4 as uuid } from "uuid"
import { Suspense } from "react"
import Search from "./search"
import Skeleton from "./skeleton"
import Await from "./await"
import {Button} from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { BarChart,Plus } from 'lucide-react'
import { convertToPlainObject } from "@/lib/utils/utils"
import Pagination from "@/app/components/documents/Pagination"
import List from "./components/List"
import { getMateriaPrimasAction, getMateriaPrimasByOrganizationPaginationAction } from "@/app/actions"
import AddButton from "./components/AddButton"

import {  getEntriesByRecordIdAction, getRecordByNameAction } from "@/app/_actions"
import EntriesTable from "@/app/components/entries/EntriesTable"
import ButtonAddEntrie from "@/app/components/entries/ButtonAddEntrie"

const MateriasPrimas = async(searchParams) => {

    const session = await getServerSession(authOptions)
    const { status, materiasPrimas, message } = await getMateriaPrimasAction(session?.user?.organization)
    const {  record } = await getRecordByNameAction('Materias Primas',session?.user?.organization)

    if (!record) {
      return <div>No se encontró el registro de Materias Primas.</div>
    }

    const entries = await getEntriesByRecordIdAction(record[0]._id)

    
    

    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
    const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 12
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

    if (status === 500) {
      return <div className="text-red-500">{message}</div>
    }

    const promise=getMateriaPrimasByOrganizationPaginationAction(session?.user?.organization,search,page,limit)

  return (
  <>

    <section className='flex-1 overflow-y-auto bg-white p-5' key={uuid()}>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Materias Primas</h1>
            <div className="flex items-center space-x-2">
              <Search search={search} className="h-4 w-4 mr-2"/>
              <Button className='ml-2'> Buscar</Button>
              <AddButton/>
            </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <BarChart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materiasPrimas?.length>=0 ? materiasPrimas?.length : 0 }</div>
              </CardContent>
            </Card>
        </div>

      <Suspense fallback={<Skeleton />}>
        <Await promise={promise}>
          {(data) => (
            <>
              <List list={convertToPlainObject(data.materiasPrimas)} />
              <Pagination
                currentPage={data.page}
                totalItems={data.totalDocs}
                itemsPerPage={limit}
                totalPages={data.totalPages}
              />
            </>
          )}
        </Await>
      </Suspense>
      
    </section>
    <section className="flex-1 overflow-y-auto bg-white p-5">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Lista</h1>
        <div className="flex items-center">
            {record[0].isActive && <ButtonAddEntrie record={record[0]}/>}
        </div>
    </div>
    <EntriesTable record={record[0]} entries={convertToPlainObject(entries)}/>
    </section>
    </>
  )
}

export default MateriasPrimas