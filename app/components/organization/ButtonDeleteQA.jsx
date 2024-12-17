'use client'
import React ,{Fragment}from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { deleteQaAction } from '@/app/_actions'
import { useSession } from 'next-auth/react'

const ButtonDeleteQA = ({qaid}) => {
    const {data:session} = useSession()
 
    const onDeleteAction = async (e)=>{
        e.preventDefault();
        const response=await deleteQaAction(session?.user?.organization,qaid)
    }
  return (
    <Fragment>
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
            <TrashIcon className="h-6 w-6" />
        </button>
    </Fragment>
  )
}

export default ButtonDeleteQA