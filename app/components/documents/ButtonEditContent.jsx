'use client'
import React,{useState,Fragment} from 'react'
import OffCanvasAddContent from './OffCanvasAddContent';

const ButtonEditContent = ({document,paragraph}) => {

    const [modalShow, setModalShow] = useState(false);

    const handleClick=(e)=>{
            e.preventDefault();
            setModalShow(!modalShow)
    }

  return (
    <Fragment>
        <button 
            type="button" 
            className="inline-block text-blue-500 hover:text-blue-700"
            onClick={handleClick}
            >Editar
        </button>
        {/*<OffCanvasAddAccess open={modalShow} setOpen={setModalShow} document={document}/>*/}
        <OffCanvasAddContent open={modalShow} setOpen={setModalShow} initialParagraph={paragraph} documentid={document?._id} documentStatus={document?.status}/>
    </Fragment>
  )
}

export default ButtonEditContent