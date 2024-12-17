'use client'
import {Fragment,useState} from 'react'
import EntrieAddModal from './EntrieAddModal'
import OffCanvasAddEntrie from './OffCanvasAddEntrie'

const ButtonAddEntrie = ({record}) => {

    const [showModal,setShowModal]=useState(false)
    const handleModal=()=>{
        setShowModal(!showModal)
    }

  return (
    <Fragment>
            <button 
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mr-5"
                onClick={handleModal}
            >Agregar</button>
            <OffCanvasAddEntrie open={showModal} setOpen={setShowModal} initialRecord={record} />
    </Fragment>
  )
}

export default ButtonAddEntrie