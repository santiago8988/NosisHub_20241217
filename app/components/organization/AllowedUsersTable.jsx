
import Link from "next/link"
import {Button} from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import ButtonUserStatus from './ButtonUserStatus';

const AllowedUsersTable = ({allowedUsers}) => {
   
  return (
    <Card>
        <CardHeader>
            <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Creado por</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allowedUsers.map((user,index) => (
                <TableRow key={index}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.area}</TableCell>
                    <TableCell>
                        <ul className="list-disc pl-4">
                            {user.position && user.position.map((position, posIndex) => (
                                <li key={posIndex}>{position}</li>
                            ))}
                        </ul>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.createdBy}</TableCell>
                    <TableCell><ButtonUserStatus isActive={user.isActive==='active' ? true : false} userid={user._id}/></TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}

export default AllowedUsersTable