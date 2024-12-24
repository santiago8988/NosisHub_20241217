'use client'

import Link from "next/link"
import {Button} from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"

const List = ({list}) => {
   
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
                            <TableHead>Materia Prima</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Código Interno</TableHead>
                            <TableHead>Sinónimos</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list?.map((record) => (
                        <TableRow key={record._id}>
                            <TableCell>{record.nombre}</TableCell>
                            <TableCell>{record.codigo}</TableCell>
                            <TableCell>{record.codigoInterno}</TableCell>
                            <TableCell>iterar sinonimos</TableCell> 
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
        </Card>
    </>
  )
}

export default List