'use client'
import React,{useState,Fragment} from 'react'
import OffCanvasHistory from './OffCanvasHistory'

const ButtonHistory = ({documentid,history,status}) => {

    const [modalShow,setModalShow]=useState(false)

    const handleClick = async (e)=>{
        e.preventDefault()
        setModalShow(true)
    }

  return (
    <Fragment>
        <button 
            className="text-sm inline-block text-blue-500 hover:text-blue-700"
            onClick={handleClick}
            >Ver Historial
        </button>
    <OffCanvasHistory open={modalShow} setOpen={setModalShow} documentid={documentid} history={history} status={status}/>
    </Fragment>
  )
}

export default ButtonHistory