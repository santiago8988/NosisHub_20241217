'use client'
import Link from 'next/link'
import {Fragment} from 'react'
import DaysLeft from '../ui/DaysLeft'
const ActiveEntrieTableRow = ({index,entrieId,recordName,dueDate,item}) => {
  return (
    <Fragment>
            <tr className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className='text-blue-500'><Link href={`/entrie/${entrieId}`}>{entrieId}</Link></td>
                <td>{recordName}</td>
                <td>{dueDate} <span><DaysLeft entry={item}/></span></td>
                <td className='text-blue-500'><Link href={`/entrie/${entrieId}`}>Completar</Link></td>
            </tr>
    </Fragment>
  )
}

export default ActiveEntrieTableRow