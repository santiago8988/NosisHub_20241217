'use client'
import React ,{Fragment}from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { deleteCollaboratorsAction } from '@/app/_actions'

const DeleteCollaboratorButton = ({collaboratorid,recordid}) => {

    const onDeleteAction = async (e)=>{
        e.preventDefault();
        const response = await deleteCollaboratorsAction(collaboratorid,recordid)
    }
  return (
    <Fragment>
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
            <TrashIcon className="h-6 w-6" />
        </button>
    </Fragment>
  )
}

export default DeleteCollaboratorButton