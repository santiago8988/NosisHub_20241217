'use client'
import {useState,Fragment} from 'react'
import { changeStatusAction,createHistoryAction} from "@/app/_actions";
import { useSession } from 'next-auth/react';
import OffCanvasAddComment from './OffCanvasAddComment';

const ButtonNextStatus = ({documentid,currentStep}) => {

    const { data: session } = useSession();
    const [modalShow,setModalShow]=useState(false)
    const stepsModel = ['draft', 'created', 'reviewed', 'approved','published','obsolete']

    const handleModal=()=>{
      setModalShow(true);
    }

    /*const handleClick = async (e)=>{
            e.preventDefault()
            const indexCurrentStep = stepsModel.indexOf(currentStep);
            const indexNextStep=indexCurrentStep+1
            const nextStep=stepsModel[indexNextStep]
            const response = await changeStatusAction(documentid,nextStep)
            if(response.status===200){
              const response2=await createHistoryAction(session?.user?.id,'aprobado',null,documentid)
            }
    }*/
  return (
    <Fragment>
          <button 
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={handleModal}
              >Aprobar
          </button>
          <OffCanvasAddComment open={modalShow} setOpen={setModalShow} documentid={documentid} actionValue={'aprobado'} currentStep={currentStep}/>
    </Fragment>
  )
}

export default ButtonNextStatus