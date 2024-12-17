'use client'

import Link from "next/link"
import {Button} from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"

const RecordList = ({recordList}) => {
   
  return (
    <>
        <Card>
                <CardHeader>
                    <CardTitle>Lista</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Registro</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recordList?.records?.map((record) => (
                        <TableRow key={record._id}>
                            <TableCell className="font-medium"><Link href={`/RecordList/${record._id}`}>{record._id}</Link></TableCell>
                            <TableCell><Link href={`/RecordList/${record._id}`}>{record.name}</Link></TableCell>
                            <TableCell>
                                <Link href={`/RecordList/${record._id}`}><Button variant="outline" size="sm">Ir</Button></Link>        
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
        </Card>
    </>
  )
}

export default RecordList