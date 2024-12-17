'use client'
import React ,{Fragment, useEffect, useState}from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { deleteAreaAction, deleteCollaboratorsAction } from '@/app/_actions'
import OffCanvasDeleteArea from './OffCanvasDeleteArea'
import { useSession } from 'next-auth/react'

const DeleteAreaButton = ({areaid,areaName}) => {
    const {data:session} = useSession()
    const [modalShow,setModalShow]=useState(false)
    const [confirm,setConfirm]=useState(false)

    useEffect(()=>{
          if(confirm){
            const deleteArea= async()=>{
              const response=await deleteAreaAction(session?.user?.organization,areaid)
            }
            deleteArea();
          }
    },[confirm])
    const onDeleteAction = async (e)=>{
        e.preventDefault();
        setModalShow(true)
    }
  return (
    <Fragment>
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
            <TrashIcon className="h-6 w-6" />
        </button>
       <OffCanvasDeleteArea open={modalShow} setOpen={setModalShow} areaName={areaName} setConfirm={setConfirm} />
    </Fragment>
  )
}

export default DeleteAreaButton