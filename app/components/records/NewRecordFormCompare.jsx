'use client'
import { useState,useEffect,Fragment } from "react"
import NewRecordAddComparison from "./NewRecordAddComparison"
const NewRecordFormCompare = ({record,setRecord,setActiveTab}) => {

    const [comparisonFields,setComparisonFields]=useState([])

    useEffect(()=>{
        if(record && record.own && Object.keys(record?.own).length!==0){
          const comparisonFiltered=Object.keys(record.own).filter(key=>{
            const campo = record.own[key];
            if(campo.tipo==='comparacion' ){
              return key
            }
          })
          setComparisonFields(comparisonFiltered)
        }
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault()
        setActiveTab('formula')
    }

  return (
    <Fragment>
        { comparisonFields.length!==0 ? 
                    (
                        <Fragment>
                            {comparisonFields.map((field,index)=>{
                               return( <Fragment key={index}>
                                        <NewRecordAddComparison
                                            record={record}
                                            setRecord={setRecord}
                                            comparisonField={field}
                                        />
                                </Fragment>)
                            })
                            }
                        </Fragment>
                    )
                    :
                    (
                        <p>No hay campos comparación para configurar</p>
                    )
        
        }
        <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={()=>setActiveTab('propio')}>
                    Anterior
                </button>
                <button
                    onClick={()=>setActiveTab('formula')}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                   Siguiente
                 </button>
        </div>
    </Fragment>
  )
}

export default NewRecordFormCompare