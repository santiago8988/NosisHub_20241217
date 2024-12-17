'use client'
import {useState,Fragment} from 'react'
import OffCanvasAddPdf from './OffCanvasAddPdf';

const ButtonUploadPdf = ({documentid}) => {
    const [showModal,setShowModal]= useState(false)
    
    const handleModal=(e)=>{
        e.preventDefault()
        setShowModal(true)
    }

    return (
        <Fragment>
            <button className="inline-flex items-center p-2  text-blue-500 font-bold rounded">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5"
                onClick={handleModal}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
            </button>
            <OffCanvasAddPdf open={showModal} setOpen={setShowModal} documentid={documentid}/>
        </Fragment>
    );
  };
  
  export default ButtonUploadPdf;