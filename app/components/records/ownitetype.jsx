'use client'

import React,{ useState,useEffect } from "react"
import InputReference from "./InputReference"
import InputComparacion from "./InputComparacion"
import InputEntradaRelacionada from "./InputEntradaRelacionada"
import { getActiveRecordsAction } from "@/app/_actions"

const Ownitetype = ({label, record,setRecord,onDelete}) => {

    const [type,setType]=useState(record.own ? record.own[label].tipo  : '')
    const [recordList,setRecordList]=useState([])

    useEffect(()=>{
        const fetchRecord = async () =>{
            const response = await getActiveRecordsAction()
            if(response.status===200){
                const sortedRecords = response.records.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  });
                setRecordList(sortedRecords)
            }
        }
        fetchRecord()
    },[label, record, setRecord])

    /*useEffect(()=>{
        const fetchRecord = async () =>{
            const response = await getActiveRecordsAction()
            if(response.status===200){
                const sortedRecords = response.records.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  });
                setRecordList(sortedRecords)
            }
        }
        fetchRecord()
    },[])*/

    useEffect(()=>{
            const updatedOwn={...record.own}
            updatedOwn[label].tipo= type
            setRecord({...record,own:updatedOwn})
    },[type])
    
    const handleDelete = (e)=>{
        e.preventDefault();
        onDelete(label)
    }


  return (
    <div className="mt-0 grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-6">
    <div className="flex col-span-5">
        <div className="flex gap-2 w-1/3">
            <label htmlFor={`type_${label}`} >
                Tipo
            </label>
            <div className="mt-0 w-full">
                <select
                    id={`type_${label}`}
                    name={`type_${label}`}
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    <option value="">Elige...</option>
                    <option value="text">Texto</option>
                    <option value="date">Fecha</option>
                    <option value="number">Numero</option>
                    <option value="formula">Formula</option>
                    <option value="referencia">Referencia</option>
                    <option value='comparacion'>Comparación</option>
                    <option value='entradaRelacionada'>Entrada relacionada</option>
                    <option value='user'>Usuario</option>
                    <option value='role'>Rol</option>
                    <option value='file'>Archivo</option>
                </select>
            </div>
        </div>
            {type==='referencia' && 
                        <div className="flex  gap-2 col-span-3 w-full">
                            <InputReference label={label} record={record} setRecord={setRecord} recordList={recordList}/>
                        </div>
            }
            {type==='comparacion' && 
                        <div className="flex items-center gap-2 col-span-4">
                            <InputComparacion label={label}  record={record} setRecord={setRecord}/>
                        </div>                               
            }
            {type==='entradaRelacionada' &&
                                        <div className="flex items-center gap-1 col-span-3">
                                            <InputEntradaRelacionada label={label}  record={record} setRecord={setRecord}/>
                                        </div>
            }
        </div>
        <div className="flex item-center col-span-1 mt-2 ml-auto">
            <button
                onClick={handleDelete}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                Borrar
            </button>
        </div>
    
    </div>
  )
}

export default Ownitetype