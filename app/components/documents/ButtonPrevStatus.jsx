'use client'
import {Fragment,useState} from 'react'
import { changeStatusAction, createHistoryAction } from "@/app/_actions";
import { useSession } from 'next-auth/react';
import OffCanvasAddComment from './OffCanvasAddComment';

const ButtonPrevStatus = ({documentid,currentStep}) => {
    const { data: session } = useSession();
    const stepsModel = ['draft', 'created', 'reviewed', 'approved','published','obsolete']
    const [modalShow,setModalShow]=useState(false)


    const handleModal=()=>{
      setModalShow(true);
    }

    /*const handleClick = async (e)=>{
            e.preventDefault()
            const indexCurrentStep = stepsModel.indexOf(currentStep);
            const indexNextStep=indexCurrentStep-1
            const nextStep=stepsModel[indexNextStep]
            const response = await changeStatusAction(documentid,nextStep)
            if(response.status===200){
              const response2=await createHistoryAction(session?.user?.id,'rechazado',null,documentid)
            }
    }*/

  return (
    <Fragment>
        <button 
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={handleModal}
            >Revisar
        </button>
        <OffCanvasAddComment open={modalShow} setOpen={setModalShow} documentid={documentid} actionValue={'rechazado'} currentStep={currentStep}/>
    </Fragment>
  )
}

export default ButtonPrevStatus