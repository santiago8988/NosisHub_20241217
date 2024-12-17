'use client'
import React,{useEffect,useState,Fragment} from 'react'
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

import { getActiveRecordsAction } from '@/app/_actions';
import InputAcciones from './InputAcciones';
import Button from '../Button';

const NewRecordFormAction = ({record,setRecord,setActiveTab}) => {

    const { data: session, update } = useSession()

    const [recordList,setRecordList]=useState([])
    const [recordSelected,setRecordSelected]=useState('')

  useEffect(()=>{
      const fetchData = async () =>{
        const response = await getActiveRecordsAction(session?.user?.organization)
        if(response.status===200){
          setRecordList(response.records)
        }
      }
      if(Object.keys(record).length !== 0 & recordList.length===0){
        fetchData()   
      }
  },[])

  const handleCreateAction = (e) =>{

    e.preventDefault()

    let newAction ={
      actionKey: uuidv4(),
      recordField : "",
      writeOnRecord : recordSelected,
      writeOnField : "",
      quantityType: "",
      quantityField :"",
      quantityNumber :"",    
      createdBy: session.user.email, 
    }
    const actionsUpdated=[...record.actions,newAction]
    setRecord({...record, actions:actionsUpdated});
  }

  return (

    <Fragment>
      {Object.keys(record).length !== 0 
          ?
            (
              record && record.actions.length!==0 
                ? 
                (<Fragment>
                    <form  onSubmit={handleCreateAction} className='flex'>
                        {/*<Input type='text' name='title' placeholder='Agrega nuevo campo'/>*/}
                        <select
                            type="text"
                            name="name"
                            value={recordSelected}
                            onChange={e=>setRecordSelected(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                            placeholder='Agrega nuevo registro'
                            required
                        >
                        <option value=''>Seleccione...</option>
                        {recordList.map((record) => (
                                <option key={record._id} value={record._id}>{record.name}</option>
                        ))}
                        </select>
                        <Button type='submit' className='ml-2'>
                            Agregar
                        </Button>
                    </form>
                    <h2 className='mt-10 border-b pb-2  text-lg font-medium'>
                        Acciones:
                        <p className="text-sm text-gray-500">* Seleccionar el campo que impactará en el registro elegido.</p>
                    </h2>
        
                    <ul className='mt-4 flex flex-col gap-1'>
                        {/*ownFields?.map(field => <TodoItem key={todo.id} todo={todo} />)*/}
                        <div>
                            {record.actions.map(action => 
                                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6" key={action.actionKey}>
                                                      <div className="sm:col-span-6">
                                                            <InputAcciones record={record} setRecord={setRecord} action={action} recordList={recordList}/>
                                                       </div>
                                                      </div>    
                                                        )}
                        </div>
                    </ul>
                 </Fragment>)
                :
                (
                  <Fragment>
                    <form  onSubmit={handleCreateAction} className='flex'>
                        {/*<Input type='text' name='title' placeholder='Agrega nuevo campo'/>*/}
                        <select
                            type="text"
                            name="name"
                            value={recordSelected}
                            onChange={e=>setRecordSelected(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                            placeholder='Agrega nuevo campo'
                            required
                        >
                        <option value=''>Seleccione...</option>
                        {recordList.map((record) => (
                                <option key={record._id} value={record._id}>{record.name}</option>
                        ))}
                        </select>
                        <Button type='submit' className='ml-2'>
                            Agregar
                        </Button>
                    </form>
                    <h2 className='mt-10 border-b pb-2 text-lg font-medium'>
                        Acciones:
                        <p className="text-sm text-gray-500">* Seleccionar el campo que impactará en el registro elegido.</p>
                    </h2>
                    <p>El registro no posee acciones aún</p>
                 </Fragment>
                )
                
            )
          : 
          (
            <p>No hay registro. Configure los pasos anteriores</p>
          )
          }
          <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={()=>setActiveTab('formula')}>
                  Anterior
                </button>
                <button
                       onClick={()=>setActiveTab('finalizar')}
                       className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >Siguiente
                </button>
          </div>
</Fragment>
  )
}

export default NewRecordFormAction