'use client'
import React ,{Fragment}from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { deleteDocumentAccessAction } from '@/app/_actions'

const ButtonDeleteAccess = ({roleid,documentid}) => {

    const onDeleteAction = async (e)=>{
        e.preventDefault();
        const response = await deleteDocumentAccessAction(documentid,roleid)
    }
  return (
    <Fragment>
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
            <TrashIcon className="h-4 w-4" />
        </button>
    </Fragment>
  )
}

export default ButtonDeleteAccess