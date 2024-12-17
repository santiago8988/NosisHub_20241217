'use client'

import Link from "next/link"
import {Button} from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"

const Documents = ({documents}) => {
   
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
                            <TableHead>#</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents?.map((document,index) => (
                        <TableRow key={document._id}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell className="font-medium">{document._id}</TableCell>
                            <TableCell>{document.name}</TableCell>
                            <TableCell>{document.status}</TableCell>
                            <TableCell>
                                <Link href={`/document/${document._id}`}><Button variant="outline" size="sm">Ir</Button></Link>        
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

export default Documents