'use client'
import { useState } from 'react'
import {Button} from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import AddCanvas from "./AddCanvas"

const List = ({list}) => {

    const [isAddCanvasOpen, setIsAddCanvasOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
  
    const handleEditClick = (record) => {
      setSelectedRecord(record)
      setIsAddCanvasOpen(true)
    }
   
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
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Unidad</TableHead>
                            <TableHead>Lote</TableHead>
                            <TableHead>Fecha Ingreso</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list?.map((record) => (
                        <TableRow key={record._id}>
                            <TableCell>{record.materiaPrima.nombre}</TableCell>
                            <TableCell>{record.cantidad}</TableCell>
                            <TableCell>{record.unidad}</TableCell>
                            <TableCell>{record.lote}</TableCell>
                            <TableCell>{record.fechaIngreso}</TableCell>
                            <TableCell>
                                <Button 
                                    onClick={() => handleEditClick(record)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >Editar</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
        </Card>
        {isAddCanvasOpen && (
        <AddCanvas
          open={isAddCanvasOpen}
          setOpen={setIsAddCanvasOpen}
          ingresoMateriaPrima={selectedRecord}
        />
      )}
    </>
  )
}

export default List