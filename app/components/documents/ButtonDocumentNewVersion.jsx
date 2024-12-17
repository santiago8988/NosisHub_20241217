'use client'
import {Fragment,useState} from 'react'
import OffCanvas from './OffCanvas'

const ButtonDocumentNewVersion = ({document}) => {
    const [showCanvas,setShowCanvas]=useState(false)

    const handleOffCanvas = ()=>{
        setShowCanvas(!showCanvas)
    }
  return (
    <Fragment>
        <button 
            className={`rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 
                        ${document?.status === 'obsolete' ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={document?.status === 'obsolete'} 
            onClick={handleOffCanvas}
        >Nuevo</button>
        <OffCanvas open={showCanvas} setOpen={setShowCanvas} documentid={document._id}/>
    </Fragment>
  )
}

export default ButtonDocumentNewVersion