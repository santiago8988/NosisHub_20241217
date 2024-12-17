'use client'

import React,{ Fragment, useEffect, useRef, useState } from "react"
import OwnItem from '@/components/records/ownitem'
import { Input } from "../ui/Input"
import {Button} from '../ui/button'
import { v4 as uuidv4 } from 'uuid';

const NewRecordForm2 = ({record,setRecord,setActiveTab}) => {
    
    const formRef = useRef();
    const [ownFields,setOwnFields]=useState({})
    const [newFieldName, setNewFieldName] = useState('');
    const [message,setMessage]=useState('')
    const [errorMessage,setErrorMessage]=useState('')

    useEffect(()=>{

        if(Object.keys(record).length!==0){
                setMessage('')
                if(record && record.own){
                    if(Object.keys(record?.own).length ===0){
                        const own = {};
                        if(record.type === 'PERIODIC' || record.type === 'NOT PERIODIC'){
                            own['FECHA'] = {tipo: 'date'};
                        }
                    
                        if(record.type === 'NOT PERIODIC WITH REVISION'){
                            own['FECHA'] = {tipo: 'date'};
                            own['VENCIMIENTO'] = {tipo: 'date'};
                        }
                        const ownUpdate={...own}
                        setRecord({...record,own: ownUpdate})
                        setOwnFields(own)
                    }else if(Object.keys(record?.own).length>0){
                        
                        setOwnFields(record.own)
                    }
                }
        }else{
            setMessage('No hay registro. Configure el paso anterior.')
        }

       
    },[])

    const handleSubmit=(e)=>{
        e.preventDefault()
 
          if(record && Object.keys(ownFields).includes(newFieldName)){
            setMessage('El campo ya existe')
            setTimeout(()=>{
                setMessage('')
            },3000)
            return 
          }
          let newOwn={}
          newOwn[`${newFieldName}`]={tipo:''}
          setOwnFields({...ownFields,...newOwn})
          const ownUpdate={...ownFields,...newOwn}
          setRecord({ ...record, own: ownUpdate })
          setNewFieldName('')   
    }

    const handleSubmitOwnFields = (e)=>{
        e.preventDefault();

        const own = {};
        const formData = new FormData(formRef.current);

        const recordReference = formData.get('type_A');
        const fields=Object.keys(record.own);

        fields.forEach((field) =>{
            let record='';
            let campo='';
            let operation='';
            let value1='';
            let value2='';
            let operationType=''
            let fieldsToWrite=[];
            let entrie='';
            let defaultField=''

            const index = field
            const value = field;
            const tipo= formData.get(`type_${index}`);
 
            own[value] = { tipo};
            if(tipo=== 'referencia'){
              record = formData.get(`recordReference_${index}`);
              campo = formData.get(`fieldReference_${index}`);
              own[value].record = record;
              own[value].campo = campo;

            }
            if(tipo=== 'comparacion'){
                operation = formData.get(`operacion_${index}`);
                operationType=formData.get(`operationType_${index}`);
                if(operationType==='valor'){
                    value1 = formData.get(`operationValue1_${index}`);
                    if(operation ==='entre'){
                      value2 = formData.get(`operationValue2_${index}`);
                    }
                }else{
                  value1='',
                  value2=''
                }
                own[value].operation = operation;
                own[value].field = defaultField;
                own[value].operationType = operationType;
                own[value].value1 = value1;
                own[value].value2 = value2;
            }
            if(tipo==='entradaRelacionada'){
              record = formData.get(`recordEntrieReference_${index}`);
              fieldsToWrite=selectedOptions;
              own[value].record=record
              own[value].fieldsToWrite=fieldsToWrite
              own[value].entrie=entrie
            }
        })
        
        const isValid = isValidRecord(record.identifier,own,record.type)
        if(isValid.status){
            setRecord({...record,own:own})
            setActiveTab('comparacion')
        }else{
            setErrorMessage(isValid.msg);
            setTimeout(()=>{
                setErrorMessage('')
            },3500)
        }
        
    }

    const isValidRecord = (identifier,own,type) =>{
            const isValidObject=validateObject(own)
            if(!isValidObject) return {msg:'Faltan completar campos propios',status:false}

            if(identifier.length===0) return {msg:'El registro no posee identificador',status:false}

            if(type==='PERIODIC'){
                    if (identifier.length === 1 && identifier.includes('FECHA')) {
                        return {msg:'FECHA no puede ser el único identificador del registro',status:false};
                    }   
            }
            if(type==='NOT PERIODIC WITH REVISION'){
                   if (identifier.length === 2 && identifier.includes('FECHA') && identifier.includes('VENCIMIENTO')) {
                       return {msg:'FECHA y VENCIMIENTO no pueden ser el único identificador del registro',status:false};
                   }
           }
           if(type==='NOT PERIODIC'){
                if (identifier.length === 1 && identifier.includes('FECHA')) {
                    return {msg:'FECHA no puede ser el único identificador del registro',status:false};
                }   
            }
            /*console.log('identifier',identifier)
            console.log('own',own)
            console.log('type',type)*/
            return {msg:'Registro válido',status:true}
    }

    function validateObject(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                
                // Verifica si el valor es un objeto
                if (typeof value === 'object' && value !== null) {
                    // Excepción para 'entradaRelacionada' con la key 'entrie'
                    if (value.tipo === 'entradaRelacionada') {
                        if(key === 'entrie'){
                            continue;
                        }
                        if (Array.isArray(value.fieldsToWrite) && value.fieldsToWrite.length === 0) {
                            return false;
                        }
                    }
                    if (value.tipo === 'comparacion'){
                            continue
                    }
                    // Recursivamente valida el objeto
                    if (!validateObject(value)) {
                        return false;
                    }
                } else {
                    // Verifica que el valor no sea vacío, excepto para 'entrie' si tipo es 'entradaRelacionada'
                    if (value === '' || value === null || value === undefined) {
                        if (!(key === 'entrie' && obj.tipo === 'entradaRelacionada')) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    const handleInputChange = (event) => {
        setNewFieldName(event.target.value.toUpperCase());
      };

    const onDelete=(key)=>{
        let ownUpdated={...record.own}
        delete ownUpdated[key];
        setRecord({...record,own:ownUpdated})
        setOwnFields(ownUpdated)
   }

  return (
    <Fragment>
        {record && Object.keys(record).length!==0 
            ? 
            (<React.Fragment>
                <form  onSubmit={handleSubmit} className='flex'>
                    {/*<Input type='text' name='title' placeholder='Agrega nuevo campo'/>*/}
                    <input
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        value={newFieldName}
                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                        placeholder='Agrega nuevo campo'
                        required
                    />
                    <Button type='submit' className='ml-2'>
                        Agregar
                    </Button>
                </form>
                {message!=='' && <p className="text-sm text-red-400">{message}</p>}
                <h2 className='mt-10 border-b pb-2 text-lg font-medium'>
                    Campos propios:
                    <p className="text-sm text-gray-500">* Tildar la casilla definirá al campo como un identificador del registro.</p>
                </h2>

                <ul className='mt-4 flex flex-col gap-1'>
                    {/*ownFields?.map(field => <TodoItem key={todo.id} todo={todo} />)*/}
                    <form ref={formRef} onSubmit={handleSubmitOwnFields}>
                        {errorMessage && (
                            <div className="mt-6 flex justify-center">
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Error: </strong>
                                    <span className="block sm:inline">{errorMessage}</span>
                                </div>
                            </div>
                        )}
                        <div className="mb-5">
                            {Object.keys(ownFields).map(fieldName => 
                                                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6" key={fieldName}>
                                                                    <div className="sm:col-span-6">
                                                                        <OwnItem   
                                                                            label={fieldName}
                                                                            value={ownFields[fieldName]}
                                                                            identifier={record.identifier}
                                                                            setRecord={setRecord}
                                                                            record={record}
                                                                            onDelete={onDelete}
                                                                        />
                                                                    </div>
                                                                </div>    
                                                        )}
                        </div>
                            <div className="mt-5 flex items-center justify-end gap-x-6">
                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={()=>setActiveTab('inicial')}>
                                    Anterior
                                </button>
                                <button
                                    onClick={()=>setActiveTab('comparacion')}
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                    Siguiente
                                </button>
                            </div>
                    </form>
                </ul>
             </React.Fragment>)
            :
            (
                <p>{message!=='' && message}</p>
            )
            }

  </Fragment>
  )
}

export default NewRecordForm2