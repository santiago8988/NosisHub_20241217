'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { createRecordAction, getActiveRecordsAction } from '@/app/_actions'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

const NewRecordForm1 = ({record,setRecord,selectTab,initialValues}) => {

    const { data: session, update } = useSession()
    const [nameValue,setNameValue]=useState(record ? record.name : '')
    const [type,setType] = useState(record ? record.type : '')
    const[periodicityValue,setPeriodicityValue] = useState(record ? record.periodicity :'');
    const[notifyValue,setNotifyValue] = useState(record ? record.notify :'');
    const[description,setDescription] = useState(record ? record.description :'');
    const [recordList,setRecordList]=useState([])
    const [msg,setMsg]=useState('')
    const [id,setId] = useState('')

    useEffect(()=>{
        const fetchData = async () =>{
          const response = await getActiveRecordsAction()
          if(response.status===200){
            setRecordList(response.records)
          }
        }
        if(recordList.length===0){
          fetchData()   
        }
    },[])

    useEffect(()=>{
          setRecord({...record,name:nameValue})
    },[nameValue])

    /*useEffect(()=>{
      const ownUpdated = { ...record.own };
      // Valores por defecto basados en el nuevo tipo
      if (type === 'PERIODIC' || type === 'NOT PERIODIC') {
          ownUpdated['FECHA'] = { tipo: 'date' };
          delete ownUpdated['VENCIMIENTO']; // Remover si existe para otros tipos
      } else if (type === 'NOT PERIODIC WITH REVISION') {
          ownUpdated['FECHA'] = { tipo: 'date' };
          ownUpdated['VENCIMIENTO'] = { tipo: 'date' };
      } else {
          delete ownUpdated['FECHA'];
          delete ownUpdated['VENCIMIENTO'];
      }
      setRecord({...record,type:type,own: ownUpdated})
    },[type])*/

    useEffect(()=>{
      setRecord({...record,periodicity:periodicityValue})
    },[periodicityValue])

    useEffect(()=>{
      setRecord({...record,notify:notifyValue})
    },[notifyValue])

    useEffect(()=>{
      setRecord({...record,description:description})
    },[description])

    const handlePeriodicityChange = (e) => {
        const inputText = e.target.value;
        // Verificar si el input es un número válido
        if (/^\d*$/.test(inputText)) {
          // Actualizar el estado solo si es un número válido
          setPeriodicityValue(inputText);
        }
      };

      const handleNotifyChange = (e) => {
        const inputText = e.target.value;
        // Verificar si el input es un número válido
        if (/^\d*$/.test(inputText)) {
          // Actualizar el estado solo si es un número válido
          setNotifyValue(inputText);
        }
      };
    
    async function handleSubmit(formData) {
      
        const { name,type } = Object.fromEntries(formData.entries())
        const email = session?.user?.email

        const isValid = isValidForm(name,type,periodicityValue,notifyValue)

        if(isValid.status){
            const newRecord={
              name:name,
              type:type,
              periodicity:periodicityValue,
              notify:notifyValue,
              description:description,
              createdBy: email,
              own:{},
              identifier:[],
              actions:[]
            }
        setRecord({...newRecord})
        selectTab('propio')
        }


        /*const isValid = isValidForm(name,type,periodicityValue,notifyValue)
        if(isValid.status===true){
              const newRecord={
                name:name,
                type:type,
                periodicity:periodicityValue,
                notify:notifyValue,
                createdBy: email,
              }
              const response = await createRecordAction(newRecord);
              if(response.status===200){
                setId(response.recordId)
                setRecord({...newRecord,id:response.recordId})
                selectTab('propio')
              }
        }else{
            setMsg(isValid.msg)
            
            setTimeout(()=>{
                setMsg('')
            },3000)
            return
        }
        return*/
        // Show a toast notification
        /*toast('Your name has been updated successfully.', {
          theme: 'dark',
          type: 'success',
          autoClose: 2000
        })*/
        }
      

      const isValidForm= (name,type,periodicityValue,notifyValue)=>{
        if([name,type,periodicityValue,notifyValue].includes('')) {
            return {status: false, msg:'Hay campos sin completar'}
        }
        if(notifyValue > periodicityValue){
          return {status: false, msg:'El campo Notificar no puede ser mayor al campo Periodicidad',code:1}
        }
        const estaIncluido = recordList.some(record => record.name === name);
        
        if(estaIncluido){
          return {status: false, msg:'Nombre en uso',code:2}
        }
        return {status: true, msg:'Datos validos'}
      }

      const handleType = (e)=>{
        e.preventDefault()
        const selectedType = e.target.value; // Obtener el valor seleccionado del select
        const ownUpdated = { ...record.own };
        // Valores por defecto basados en el nuevo tipo
        if (type === 'PERIODIC' || type === 'NOT PERIODIC') {
            ownUpdated['FECHA'] = { tipo: 'date' };
            delete ownUpdated['VENCIMIENTO']; // Remover si existe para otros tipos
        } else if (type === 'NOT PERIODIC WITH REVISION') {
            ownUpdated['FECHA'] = { tipo: 'date' };
            ownUpdated['VENCIMIENTO'] = { tipo: 'date' };
        } else {
            delete ownUpdated['FECHA'];
            delete ownUpdated['VENCIMIENTO'];
        }
        setType(selectedType)
        setRecord({...record,type:selectedType,own: ownUpdated,periodicity:'',notify:''})
        setPeriodicityValue('')
        setNotifyValue('')
      }

  return  (
    <form action={handleSubmit}>
      <div className="space-y-10">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Formulario</h2>
          {msg && <p className='text-red-500'>{msg}</p>}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-5">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={nameValue}
                    readOnly={record._id ? true : false}
                    disabled={record._id ? true : false}
                    onChange={(e)=>setNameValue(e.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Ingrese nombre del registro..."
                  />
                
                </div>
              </div>
            </div>
            <div className='col-span-2'>
                <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                    Tipo
                </label>
                <div className="mt-2">
                    <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={e => handleType(e)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                    <option value=''>Elige...</option>
                    <option value='PERIODIC'>PERIODICO</option>
                    <option value='NOT PERIODIC'>NO PERIODICO</option>
                    <option value='NOT PERIODIC WITH REVISION'>NO PERIODICO CON REVISION</option>
                    </select>
                </div>
            </div>
            {
                type==='PERIODIC' && 
                    <div className='col-span-2'>
                            <label htmlFor="periodicity" className="block text-sm font-medium leading-6 text-gray-900">Frecuencia</label>
                            <div className='mt-2'>
                                <input 
                                    type="text" 
                                    value={periodicityValue} 
                                    onChange={handlePeriodicityChange}
                                    name='periodicity'
                                    id='periodicity'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                                <span className='text-sm text-gray-500'>* Cantidad de días entre cada entrada.</span>
                            </div>
                    </div>
                
            }
            {
                (type==='PERIODIC' || type==="NOT PERIODIC WITH REVISION") && 
          (          <div className='col-span-2'>
                             <label htmlFor="notify" className="block text-sm font-medium leading-6 text-gray-900">Notificar</label>
                            <div className='mt-2'>
                                <input 
                                    type="text" 
                                    value={notifyValue} 
                                    onChange={handleNotifyChange}
                                    name='notify'
                                    id='notify'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                                <span className='text-sm text-gray-500'>* Cantidad de días para notificar antes de vencer.</span>
                            </div>

                    </div>)
            }

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Descripción
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={description} 
                  onChange={e=>setDescription(e.target.value)}
                />
              </div>
    
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancelar
        </button>
        <button
          onClick={() => selectTab('propio')}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Siguiente
        </button>
      </div>
    </form>
  )
}
export default NewRecordForm1