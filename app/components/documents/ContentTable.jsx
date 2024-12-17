'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import ButtonEditContent from './ButtonEditContent'
import ButtonDeleteParagraph from './ButtonDeleteParagraph'

const ContentTable = ({document}) => {
  return (
    <Card>
          <CardHeader>
              <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Agregado por</TableHead>
                      <TableHead>Imagen</TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {document.document.content.map((paragraph,index) => (
                  <TableRow key={index}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{paragraph.title}</TableCell>
                      <TableCell>{paragraph.addedBy}</TableCell>
                      <TableCell>{paragraph.image ? 'SI' : 'NO'}</TableCell>
                      <TableCell><ButtonEditContent document={document.document} paragraph={paragraph}/></TableCell>
                      <TableCell><ButtonDeleteParagraph paragraphid={paragraph._id} documentid={document?.document?._id}/></TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
          </CardContent>
      </Card>
  )
}

export default ContentTable