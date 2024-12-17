'use client'
import React,{useState,Fragment} from 'react'
import OffCanvasAddAccess from './OffCanvasAddAccess'
import OffCanvasAddContent from './OffCanvasAddContent';

const ButtonAddContent = ({document}) => {

    const [modalShow, setModalShow] = useState(false);

    const handleClick=(e)=>{
            e.preventDefault();
            setModalShow(!modalShow)
    }

  return (
    <Fragment>
        <button 
            className={`rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 
                        ${document.status === 'obsolete' ? 'opacity-50 cursor-not-allowed' : ''}`} // Aplicar estilos de desactivación condicionalmente
            disabled={document.status === 'obsolete'} // Deshabilitar el botón
            onClick={handleClick}
            >Nuevo
        </button>
        {/*<OffCanvasAddAccess open={modalShow} setOpen={setModalShow} document={document}/>*/}
        <OffCanvasAddContent open={modalShow} setOpen={setModalShow} initialParagraph={null} documentid={document?._id} documentStatus={document?.status}/>
    </Fragment>
  )
}

export default ButtonAddContent