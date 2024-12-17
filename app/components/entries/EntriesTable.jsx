'use client'
import React, { Fragment } from 'react';
import Link from "next/link"
import {Button} from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import DaysLeft from "../ui/DaysLeft"
import UserProfileImage from "../allowedUsers/UserProfileImage"
import Base64ToPdf from "../ui/Base64ToPdf"
import ActionMenu from "./ActionMenu"


const EntriesTable = ({record,entries}) => {
   
  return (
    <>
        <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vigente</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Completó</TableHead>
                            <TableHead>Vencimiento</TableHead>
                            {record && Object.keys(record.own).map((campo) => (
                                record.own[campo].tipo === 'entradaRelacionada' ? (
                                    record.own[campo].fieldsToWrite.map(field => (
                                        <TableHead key={field.label}>
                                            {campo} {field.label}
                                        </TableHead>
                                    ))
                                ) : (
                                    <TableHead key={campo}>
                                        {campo}
                                    </TableHead>
                                )
                            ))}
                            <TableHead>PDF</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries && entries.map((entry,index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{entry.isActive ? (<Badge>SI</Badge>):(<Badge variant="secondary">NO</Badge>)}</TableCell>
                            <TableCell>{entry.completed ? (<Badge>COMPLETA</Badge>) : (<DaysLeft entry={entry}/>)}</TableCell>
                            <TableCell>{entry.completedBy ? <UserProfileImage email={entry.completedBy}/> : ''} </TableCell>
                            <TableCell>{entry.dueDate}</TableCell>
                            {Object.entries(entry.values).map(([key, value]) => (
                                <React.Fragment key={key} >
                                    {typeof value === 'object' ? (
                                        Object.entries(value).map(([subKey, subValue]) => (
                                            <TableCell key={subKey}>{`${subValue}`}</TableCell>
                                        ))
                                    ) : (
                                        <TableCell >{`${value}`}</TableCell>
                                    )}
                                </React.Fragment>
                            ))}
                            <TableCell>{entry?.pdf ? ( <Base64ToPdf base64Data={entry.pdf} fileName={`Entrada_${entry._id}`}/>) : (null)}</TableCell>
                            <TableCell><ActionMenu isActive={entry.isActive} completed={entry.completed} entrie={entry}/></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
        </Card>
    </>
  )
}

export default EntriesTable