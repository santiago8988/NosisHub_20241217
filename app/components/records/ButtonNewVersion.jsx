'use client'
import {Fragment,useState} from 'react'
import OffCanvas from './OffCanvas'

const ButtonNewVersion = ({recordid}) => {
    const [showCanvas,setShowCanvas]=useState(false)

    const handleOffCanvas = ()=>{
        setShowCanvas(!showCanvas)
    }
  return (
    <Fragment>
        <button 
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={handleOffCanvas}
        >Nueva versión</button>
        <OffCanvas open={showCanvas} setOpen={setShowCanvas} recordid={recordid}/>
    </Fragment>
  )
}

export default ButtonNewVersion