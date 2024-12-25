'use client'
import { Plus } from "lucide-react"
import {Button} from '../../../components/ui/button'
import { Fragment, useState } from "react"
import AddCanvas from "./AddCanvas"

const AddButton = () => {

    const [showModal,setShowModal]=useState(false)

    const handleClick= (e)=>{
        e.preventDefault();
        setShowModal(true);
    }

  return (
    <Fragment>
        <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleClick}
        >
            <Plus className="h-4 w-4 mr-2" />
            Ingresar Lote
        </Button>
        <AddCanvas open={showModal} setOpen={setShowModal} ingresoMateriaPrima={null}/>
    </Fragment>
  )
}

export default AddButton