'use client'
import {Fragment,useState,useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { createRecordAction, getActiveRecordsNamesAction, inactiveRecordAction } from '@/app/_actions';
import { ToastContainer, toast } from 'react-toastify'

const NewRecordValidation = ({record}) => {

    const router = useRouter()
    const { data: session, update } = useSession()

    const [records,setRecords] = useState([])
    const [status, setStatus] = useState({
        name: { loading: false, success: null, error: '' },
        type: { loading: false, success: null, error: '' },
        periodicity: { loading: false, success: null, error: '' },
        notify: { loading: false, success: null, error: '' },
        identifier: { loading: false, success: null, error: '' },
        own: { loading: false, success: null, error: '' },
        actions: { loading: false, success: null, error: [] },
      });

    useEffect(()=>{
        const fetchRecords= async ()=>{
                const data = await getActiveRecordsNamesAction()
                if(data.status===200){
                    setRecords(data.records)
                }
        }
        fetchRecords()
    },[])

    const isEmpty = (attribute,value) => {

        if(attribute==='periodicity'){
            if(record.type==='NOT PERIODIC' || record.type==='NOT PERIODIC WITH REVISION'){
                return false;
            }
        }
        if(attribute==='notify'){
            if(record.type==='NOT PERIODIC'){
                    return false;
            }
        }
        if(attribute==='actions'){
            return false
        }
        if (typeof value === 'string') {
          return !value.trim(); // Elimina espacios en blanco y verifica si la cadena está vacía
        } else if (typeof value === 'object') {
          return !Object.keys(value).length; // Verifica si el objeto no tiene propiedades
        } else {
          return !value; // Verifica si el valor es nulo o indefinido
        }
      };

    const compareValidation = (field) =>{
		let isValid = {valid:true,msg:'Válido'}
		    if((field.tipo==='comparacion')){
                  if(field.operation==='' || field.operationType===''){
						isValid.valid=false
						isValid.msg='Hay campos comparación sin completar'
                        return isValid;
                  }
                  if(field.operationType==='valor'){
                            if(field.operation!=='entre' && field.value1===''){		  
							  isValid.valid=false
							  isValid.msg='En campos comparación, hay valores sin completar'
							  return isValid;
                            }
                            if(field.operation==='entre' && [field.value1,field.value2].includes('')){
							  isValid.valid=false
							  isValid.msg='En campos comparación, hay valores sin completar'
							  return isValid;
                            }
                  }
            }
            return isValid
	}

    const formulaValidation = (field,key)=>{
       
        const { expresion } = field;
        const numberFields = Object.keys(record?.own || {}).filter(label => record.own[label]?.tipo === 'number');
        const formulaFields= Object.keys(record?.own || {}).filter(label => record.own[label]?.tipo === 'formula');
        const referenceFields=Object.keys(record?.own || {}).filter(label => record.own[label]?.tipo === 'referencia');

        // Combina todos los campos permitidos en un solo array
        const allowedFields = [...numberFields, ...formulaFields, ...referenceFields];
        
        // Crea una expresión regular para extraer todas las variables de la expresión
        const variableRegex = /\b[A-Z_]+\b/g;
        const variables = expresion.match(variableRegex);
        
        /*console.log('numberFields',numberFields)
        console.log('formulaFields',formulaFields)
        console.log('referenceFields',referenceFields)*/

        // Verifica que la expresión no contenga la clave KEY
        if (variables && variables.includes(key)) {
            return {valid:false,msg:`El campo ${key} no puede ser parte de su fórmula.`};
        }
        // Verifica que todas las variables en la expresión sean válidas
        //const allVariablesValid = variables.every(variable => allowedFields.includes(variable));
        const allVariablesValid = variables ? variables.every(variable => allowedFields.includes(variable)) : true;

        if (!allVariablesValid) {
            return {valid:false,msg:`Está usando campos en la fórmula que no son parte del registro.`};
        }

            // Verifica que todos los números en la expresión sean válidos (cualquier número es válido en este contexto)
            const numberRegex = /(\d+(\.\d+)?)/g;
            const numbers = expresion.match(numberRegex);

            const allNumbersValid = numbers ? numbers.every(number => !isNaN(number)) : true;

            return {valid:allNumbersValid,msg:`Fórmula válida.`};;
    }

    const actionValidation= (field)=>{

        const actionVerify=field.map(action=>{
            if(action.quantityType!==''){
                if(action.quantityType==='valor'){
                    if(action.quantityNumber===''){
                        return {valid:false,msg:'Acciones: "Cantidad" sin completar'}
                    }
                }
                if(action.quantityType==='campo'){
                    if(action.quantityField===''){
                        return {valid:false,msg:'Acciones: "Cantidad" sin completar'}
                    }
                }
                if(action.writeOnField===''){
                    return {valid:false,msg:'Acciones: "Campo" sin completar'}
                }
                if(action.recordField===''){
                    return {valid:false,msg:'Acciones: "Campo" sin completar'}
                }
                return {valid:true,msg:'Accion válida'}
            }else{
                return {valid:false,msg:'Acciones: "Tipo Cantidad" sin completar'}
            }
            
        })
        return actionVerify
    }

    const validateTypes = (actions) => {
        
        const actionVerify=actions.map(field=>{
                const registroSeleccionado = records.filter(record => record._id === field.writeOnRecord);
            
                if(registroSeleccionado[0].own[field.writeOnField].tipo === 'referencia' ){
        
                    const referencia = records.filter(record => record._id === registroSeleccionado[0].own[field.writeOnField].record)
        
                    if(record.own[field.recordField].tipo === referencia[0].own[registroSeleccionado[0].own[field.writeOnField].campo].tipo ){
                                return {valid:true,msg:'Tipo válido'}
                    }
                }else  if(registroSeleccionado[0].own[field.writeOnField].tipo === record.own[field.recordField].tipo ){
                                return {valid:true,msg:'Tipo válido'}
            
                }else{
                    return {valid:false,msg:'El campo origen no es del mismo tipo que el campo destino.'}
                }
        })
        return actionVerify
    }

    const validateObject=(obj)=> {
        console.log('obj',obj)
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                console.log('obj[key]',value)
                // Verifica si el valor es un objeto
                if (typeof value === 'object' && value !== null) {
                    // Excepción para 'entradaRelacionada' con la key 'entrie'
                    if(value.tipo===''){
                        return {valid:false,msg:''};
                    }
                    if (value.tipo === 'entradaRelacionada') {
                        if(key === 'entrie'){
                            continue;
                        }
                        if (Array.isArray(value.fieldsToWrite) && value.fieldsToWrite.length === 0) {
                            return {valid:false,msg:''};
                        }
                    }
                    if (value.tipo === 'comparacion'){
                            const resultado=compareValidation(value)
                            return resultado
                    }
                    if(value.tipo==='formula'){
                        const resultado=formulaValidation(value,key)
                        return resultado
                    }

                    // Recursivamente valida el objeto
                    if (!validateObject(value)) {
                        return {valid:false,msg:''};
                    }
                } else {
                    // Verifica que el valor no sea vacío, excepto para 'entrie' si tipo es 'entradaRelacionada'
                    if (value === '' || value === null || value === undefined) {
                        if (!(key === 'entrie' && obj.tipo === 'entradaRelacionada')) {
                            return {valid:false,msg:''};
                        }
                    }
                }
            }
        }
        return  {valid:true,msg:''};;
    }
 
      const verifyAttribute = async (attribute, value) => {
        
        setStatus(prev => ({
          ...prev,
          [attribute]: { loading: true, success: null, error: '' },
        }));

        let isValid = false;
        let error = '';

        if (isEmpty(attribute,value)) {
            error = `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} no puede estar vacío.`;
          } else{

              if (attribute === 'name') {
                  // Verificación del nombre
                  if(!record._id){
                      isValid = value.length > 0 && !records.some(record => record.name === value);
                      if (!isValid) {
                        error = records.some(record => record.name === value) ? 'Nombre ya existe.' : 'Nombre inválido.';
                      }
                  }else{
                        isValid=true;
                  }
                } else if (attribute === 'periodicity') {
                    // Verificación de la periodicidad
                    if(record.type==='NOT PERIODIC' || record.type==='NOT PERIODIC WITH REVISION'){
                        isValid=true;
                    }else{
                        isValid = value < record.notify;
                        if (!isValid) {
                            error = 'Periodicidad inválida. No puede ser menor que notificar.';
                        }            
                    }
                } else if(attribute === 'notify'){

                    if(record.type==='NOT PERIODIC' || record.type==='NOT PERIODIC WITH REVISION'){
                        isValid=true;
                    }else{
                        //Verificacion de la notificacion
                        isValid = record.periodicity <= value;
                        if (!isValid) {
                          error = 'Notificar inválida. No puede ser mayor que la frequencia.';
                        }
                    }
                }else if(attribute==='identifier'){
                            if(record.type==='PERIODIC'){
                                isValid= !(record.identifier.length ===1 && record.identifier.includes('FECHA'))
                                if (!isValid){
                                    error='FECHA no puede ser el único identificador del registro.'
                                }
                                
                            }
                            if(record.type==='NOT PERIODIC WITH REVISION'){
                                isValid=record.identifier.length === 2 && !record.identifier.includes('FECHA') && !record.identifier.includes('VENCIMIENTO')
                                    if(!isValid){
                                        error='FECHA y VENCIMIENTO no pueden ser el único identificador del registro.'
                                    }   
                            }   
                            if(record.type==='NOT PERIODIC'){
                                isValid=!(record.identifier.length === 1 && record.identifier.includes('FECHA'))
                                    if(!isValid){
                                        error='FECHA no puede ser el único identificador del registro.'
                                    }
                                }   
                    }else if(attribute==='own'){
                        
                        const resultado=validateObject(record.own)
                        isValid=resultado.valid     
                        if(!isValid){
                            error= resultado.msg!=='' ? resultado.msg : 'Hay campos sin completar.'
                        }
                    }else if(attribute==='type'){
                        isValid= value!==''
                        if(!isValid){
                            error='Tipo no puede estar vacio'
                        }
                    }else if(attribute==='actions'){
                        const resultado=actionValidation(value)
                        let validaType=[]
                        // Verificar si todos los resultados de validación son válidos
                        isValid = resultado.every(action => action.valid);
                        if(isValid){
                            validaType=validateTypes(value);
                            isValid = validaType.every(action => action.valid);
                        }
                        if(!isValid){
                            error=[]
                            resultado.map(result=>{
                                if(!result.valid){
                                    error.push(result.msg)
                                }
                            })
                            validaType.map(result=>{
                                if(!result.valid){
                                    error.push(result.msg)
                                }
                            })
                        }
                    }
                }
    
            setStatus(prev => ({
                ...prev,
                [attribute]: { loading: false, success: isValid, error: isValid ? '' : error },
            }));
        
            return isValid;
     };
    
      const handleCreate = async () => {
        const attributes = ['name', 'type','periodicity','notify','identifier','own','actions']; 
        let allValid = true;
           
        for (const attribute of attributes) {
          const isValid = await verifyAttribute(attribute, record[attribute]);
          if (!isValid) {
            allValid = false;
          }
        }
        if (allValid) {
            record.createdBy=session.user.id
            record.organization=session.user.organization
                const response = await createRecordAction(record)
                if(response.status===200){
                    toast(`${response.message}`, {
                        theme: 'dark',
                        type: 'success',
                        autoClose: 2000
                      })
                      if(record._id){
                        const responseInactiveRecord = await inactiveRecordAction(record._id)
                        if(responseInactiveRecord.status===200){
                            toast(`${responseInactiveRecord.message}`, {
                              theme: 'colored',
                              type: 'success',
                              autoClose: 2000
                          })
                        }
                      }
                      setTimeout(()=>{
                        router.push(`/RecordList/${response.recordId}`)
                      },2500)
                }
                if(response.status===400){
                    toast(`${response.message}`, {
                        theme: 'dark',
                        type: 'error',
                        autoClose: 2000
                      })
                }
        } 
      };

   
    const findName= ( idBuscado) => {
    const record = records.find(record => record._id === idBuscado);
    return record ? record.name : 'N/A';
  }

  return (
    <Fragment>
        {Object.keys(record).length!==0 ?
                (
                    <div>
                        <div className="px-4 sm:px-0">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Información del registro</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Verificar y crear.</p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Nombre</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{record?.name}
                                        {status.name.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                        {status.name.success === false && <span className='mx-2 text-red-500'>✗ {status.name.error}</span>}
                                    <div>
                                        {status.name.loading && <span>Verificando nombre...</span>}
                                    </div>
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Tipo</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{record?.type}
                                        {status.type.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                        {status.type.success === false && <span className='mx-2 text-red-500'>✗ {status.type.error}</span>}
                                    <div>
                                        {status.type.loading && <span>Verificando tipo...</span>}
                                    </div>
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Periodicidad</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{record.periodicity}
                                        {status.periodicity.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                        {status.periodicity.success === false && <span className='mx-2 text-red-500'>✗ {status.periodicity.error}</span>}
                                    <div>
                                        {status.periodicity.loading && <span>Verificando periodicidad...</span>}
                                    </div>
                            </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Notificar</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{record.notify}
                                        {status.notify.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                        {status.notify.success === false && <span className='mx-2 text-red-500'>✗ {status.notify.error}</span>}
                                    <div>
                                        {status.notify.loading && <span>Verificando notificar...</span>}
                                    </div>
                            </dd>
                            </div>
                    
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Campos</dt>
                            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0 mb-1">
                                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                    {Object.keys(record.own).length!==0 ? ( Object.keys(record.own).map(field=>{
                                        return(<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6" key={field}>
                                            <div className="flex w-0 flex-1 items-center">
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span className="truncate font-medium">{field}:</span>
                                                <span className="flex-shrink-0 text-gray-400">{record.own[field].tipo}</span>
                                            </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                                    Detalles
                                            </a>
                                            </div>
                                        </li>
                                    )})) :(
                                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="truncate font-medium">Aún no hay campos propios configurados.</span>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                }
                                </ul>
                                            {status.own.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                            {status.own.success === false && <span className='mx-2 text-red-500'>✗ {status.own.error}</span>}
                                        <div>
                                            {status.own.loading && <span>Verificando campos propios...</span>}
                                        </div>
                            </dd>
                            </div>

                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Identificador del registro
     
                                </dt>
                            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200 mb-1">
                                    {record.identifier.length!==0 ? ( record.identifier.map(field=>{
                                        return(<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6" key={field}>
                                            <div className="flex w-0 flex-1 items-center">
                                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span className="truncate font-medium">{field}</span>
                                                <span className="flex-shrink-0 text-gray-400">{}</span>
                                            </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                                    Detalles
                                            </a>
                                            </div>
                                        </li>
                                    )})) :(
                                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="truncate font-medium">Aún no hay identificadores configurados.</span>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                }
                                </ul>
                                            {status.identifier.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                            {status.identifier.success === false && <span className='mx-2 text-red-500'>✗ {status.identifier.error}</span>}
                                        <div>
                                            {status.identifier.loading && <span>Verificando identificadores...</span>}
                                        </div>
                            </dd>
                            </div>

                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Acciones</dt>
                            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                    {record.actions.length!==0 ? ( record.actions.map(action=>{
                                        return(<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6" key={action.actionKey}>
                                                <div className="flex w-full items-center">
                                                    {/* Primer elemento */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate font-medium">{record.name}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                        </svg>
                                                    </div>
                                                    {/* Segundo elemento */}
                                                    <div className="ml-4 flex flex-col min-w-0">
                                                        <span className="truncate font-medium">{findName(action.writeOnRecord)}</span>
                                                    </div>
                                                </div>
                                            <div className="ml-4 flex-shrink-0">
                                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                                    Detalles
                                            </a>
                                            </div>
                                        </li>
                                    )})) :(
                                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="truncate font-medium">Aún no hay acciones configuradas.</span>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                }
                                </ul>
                                        <div>
                                            {status.actions.success === true && <span className='mx-2 text-green-500'>✓</span>}
                                            {status.actions.success === false && status.actions.error.map((err,index)=>{
                                                return(<span className='mx-2 text-red-500' key={index}>✗ {err}</span>)})
                                            }
                                        </div>
                                        <div>
                                            {status.actions.loading && <span>Verificando acciones...</span>}
                                        </div>
                            </dd>
                            </div>
                    
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Descripción</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {record.description ==='' ? 'N/A' : record.description}
                            </dd>
                            </div>
                    
                        </dl>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                            Crear
                            </button>
                        </div>
                    </div>
                )
            : 
                (
                    <p className='mt-3'>No hay registro configurado aún.</p>
                )
        } 
        <ToastContainer/>

    </Fragment>

  )
};


export default NewRecordValidation