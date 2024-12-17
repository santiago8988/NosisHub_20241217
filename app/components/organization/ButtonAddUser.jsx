'use client'
import {useState,Fragment} from 'react'
import OffCanvasAddUser from './OffCanvasAddUser';

const ButtonAddUser = ({areas,positions}) => {

    const [modalShow, setModalShow] = useState(false);

    const handleClick=(e)=>{
            e.preventDefault();
            setModalShow(!modalShow)
    }

  return (
    <Fragment>
        <button 
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={handleClick}
            >Agregar
        </button>
        <OffCanvasAddUser open={modalShow} setOpen={setModalShow} organizationAreas={areas} organizationPositions={positions}/>
    </Fragment>
  )
}

export default ButtonAddUser