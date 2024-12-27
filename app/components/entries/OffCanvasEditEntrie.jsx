'use client'
import { useSession } from 'next-auth/react';
import { useParams,useRouter } from 'next/navigation'
import { useState,useEffect, useRef,Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createNextEntrie, completeEntrieAction } from '@/app/_actions';
import InputForm from '@/app/components/entries/InputForm';
import {  toast } from 'react-toastify'
import ConfirmationModal from '../ui/ConfirmationModal';


const OffCanvasEditEntrie = ({ open,setOpen,initialentrie,recordType }) => {

    const router=useRouter()
    const {data : session} = useSession()
    const [entrie,setEntrie] = useState({});
    const [record,setRecord]=useState({})
    const [confirm,setConfirm] = useState(false);
    const [action,setAction] = useState('')
    const [alerta, setAlerta] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formulasToCalculate,setFormulasToCalculate]=useState([])
    const [updatedFormObject, setUpdatedFormObject] = useState({});
    const formRef = useRef(null)
    const [formValues, setFormValues] = useState({});
    const [file, setFile] = useState('');

    useEffect(()=>{

        if(initialentrie && open){
            setEntrie(initialentrie)
            setRecord(initialentrie.record)
            setFormValues(initialentrie.values)
        }
    },[initialentrie,open])

    useEffect(()=>{
        if(record){
          const {own} = record
          own && typeof own === 'object' && Object?.keys(own)?.map((campo) =>{
              if(own[campo].tipo ==='formula'){
                setFormulasToCalculate((prevFormulas) => ({
                            ...prevFormulas,
                            [campo]: own[campo],
                    }));
              }
          })

        }

        if (record && record.own && typeof record.own === 'object') {
          const updatedInitialState = {};
      
          for (const campo in record.own) {
            if (record.own.hasOwnProperty(campo)) {
              /*updatedInitialState[campo] = record.own[campo].tipo === 'number' ? 0 : '';*/
              updatedInitialState[campo] = '';
            }
          }
          setFormValues(updatedInitialState);
        }

    },[record])

    useEffect(() => {
      
        if (confirm) {
          setIsLoading(true);
          const complete = async() =>{
  
            const form = formRef.current; 
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries());

            const response = await completeEntrieAction(entrie._id,formObject,action,session.user.email)

                if( response && recordType!=='NOT PERIODIC' && response.completed === true){
                    toast('Your entrie has been completed successfully.', {
                            theme: 'dark',
                            type: 'success',
                            autoClose: 3000
                      })
  
                      if(!response.nextCreated){
  
                          const newEntrie = await createNextEntrie(response,entrie?.record?.identifier,entrie?.record?.periodicity,entrie?.record?.type);
              
                          if (newEntrie && newEntrie._id) {
                          
                            toast('Your entrie has been created successfully.', {
                                      theme: 'dark',
                                      type: 'success',
                                      autoClose: 3000
                                        })
                                        
                            }
                       }
  
                            setTimeout(() => {
                              /*router.push(`/`);*/
                              setConfirm(false)
                              setIsLoading(false)
                              setRecord({})
                              setEntrie({})
                              setOpen(false)
                             }, 3000);
          
                } else if(response && response.completed ===false){
          
                        toast('Tu entrada ha sido editada correctamente.', {
                          theme: 'dark',
                          type: 'success',
                          autoClose: 2500
                    })
                        setTimeout(() => {
                          /*router.push(`/`);*/
                          setConfirm(false)
                          setIsLoading(false)
                          setRecord({})
                          setEntrie({})
                          setOpen(false)
                              }, 3000)
                    }else if(response && recordType==='NOT PERDIODIC'){
                              toast('Tu entrada ha sido editada correctamente.', {
                                theme: 'dark',
                                type: 'success',
                                autoClose: 2500
                          })
                          setTimeout(() => {
                            setConfirm(false)
                            setIsLoading(false)
                            setRecord({})
                            setEntrie({})
                            setOpen(false)
                           }, 3000);
                    }
            }
          complete();
        }
        
      }, [confirm]); // Utilizamos confirm como dependencia para el useEffect


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      };


    const handleConfirm = () => {
        setConfirm(true)
        handleModal();
      };

      const handleModal = () => {
        setModalShow(!modalShow);
      }

 
    const validateFormObject= (formObject)=>{
      for (const key in formObject) {
        if (formObject.hasOwnProperty(key)) {
          const value = formObject[key];
          if (typeof value !== 'object' && !(value instanceof File)){
              if (value.trim() === '') {
                return false; // Encontramos un campo vacío, la validación falla
              }
          }
        }
      }
      return true; // Todos los campos están llenos, la validación es exitosa
    }
      
    const handleSubmit = async (e , act) => {
        
        e.preventDefault();
    
        const form = formRef.current; 
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries()); 
      
        if(act === 'completar'){
            const isFormValid = validateFormObject(formObject);
  
            if(!isFormValid){
              toast('Debe llenar todos los campos para poder completar la entrada.', {
                theme: 'dark',
                type: 'error',
                autoClose: 3000
              })
              return
            }
  
            setModalShow(true);
          }else  if(act==='guardar') {setConfirm(true)};
  
      }
  
      const handleInputChange = (label, value) => {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          [label]: value,
        }));
      };

      const handleClose=()=>{
        if (formRef.current) {
            formRef.current.reset();
        }
        setFormValues({});
        setUpdatedFormObject({});
        setFile('');
        setFormulasToCalculate([]);
        setAlerta({});
        setOpen(false);
    }
            
      const {msg} = alerta;
    
        const { own, name, code, type, periodicity, identifier, actions } = record;

  return (
    <Fragment>
        <Transition show={open} as={Fragment}>
          <Dialog className="relative z-10" onClose={() => setOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-2xl">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Completar</Dialog.Title>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">

                        { msg && (<div className="flex items-start sm:items-center mb-5">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <div className="mt-2">
                                <p className="text-sm text-red-500">
                                        {msg}
                                </p>
                              </div>
                            </div>
                          </div>)}

                          <form ref={formRef} onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                {own && typeof own === 'object' && Object.keys(own).map((campo) => {
                                    const fieldValue =updatedFormObject[campo] ? updatedFormObject[campo] : entrie.values[campo]
                                    return (
                                    <div key={campo} className="mb-4">
                                        <InputForm
                                            campo={own[campo]}
                                            label={campo}
                                            type={own[campo].tipo}
                                            action={"edit"}
                                            values={fieldValue}
                                            identifier={identifier}
                                            formValues={formValues}
                                            onInputChange={handleInputChange}
                                        />
                                    </div>
                                    );
                                })}
                                <div className="mb-4">
                                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                                </div>
                                </div>
                                <div className="mt-3 mb-3 mr-5 flex items-center justify-end gap-x-6">
                                    <button 
                                        type="button" 
                                        className="text-sm font-semibold leading-6 text-gray-900"
                                        onClick={handleClose}
                                    > Cancelar</button>
                                    <button
                                        type="submit"
                                        onClick={(e) => {handleSubmit(e, "guardar");setAction('guardar')}}  
                                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        disabled={isLoading}
                                    >{isLoading ? 'Guardando...' : 'Guardar'}</button>
                                                                    <button
                                        type="submit"
                                        onClick={(e) => {handleSubmit(e, "completar");setAction('completar')}} 
                                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        disabled={isLoading}
                                    >{isLoading ? 'Guardando...' : 'Finalizar'}</button>
                                </div>
                            </form>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
        <ConfirmationModal 
              open={modalShow} 
              setOpen={setModalShow}
              title='Finalizar entrada'
              message="Si finaliza no podrá volver a editar la entrada. ¿Está seguro?"
              handleConfirm={handleConfirm}
          />                       
    </Fragment>
  );
};

export default OffCanvasEditEntrie;
