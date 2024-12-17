'use client';
import { Fragment, useState,useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select'
import { addAreaAction, addQaAction, getAllowedUsersAction } from '@/app/_actions'
import { useSession } from 'next-auth/react';

const OffCanvasAddQA = ({ open, setOpen }) => {

    const [msg, setMsg] = useState('')

    const {data: session} = useSession();
    const [collaborators,setCollaborators] = useState({})
    const [option,setOption] = useState([])
    const optionRoles =[{value:'revisar',label:'revisar'},{value:'aprobar',label:'aprobar'},{value:'publicar',label:'publicar'}]
    const [rol,setRol]=useState(null)

    useEffect(() =>{
        if(open){
            const fetchUsers = async () => {
              const data = await getAllowedUsersAction(session?.user?.organization)
              setOption(data.map(user => ({
                value: user._id,
                label: user.email
            }))); 
    
            };
            fetchUsers();
        }
      }, [open])


     const handleModal=()=>{
        setRol({})
        setCollaborators({})
        setOpen(false)
     }

    const handleSubmit= async (e)=>{
  
        e.preventDefault();

        const newQa = {
            user: collaborators.value,
            roles: [rol.value] 
        };

        const response=await addQaAction(session?.user?.organization,newQa)
        if(response.status!==200){
            setMsg(response.msg)
            setTimeout(()=>{
                    setMsg('')
            },3000)
        }else{
            handleModal()
        }
    }

    function handleSelect(data) {
        setCollaborators(data);
      }
    function handleSelectRol(data) {
        setRol(data);
    }


  return (
    <Transition show={open} as={Fragment}>
        <Dialog className="relative z-10" onClose={() => handleModal()}>
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
                            onClick={() => handleModal()}
                        >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Agregar Gestor de Calidad</Dialog.Title>
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
                        <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className="text-gray-700 uppercase font-bold text-sm">Seleccione usuario</label>
                                        <Select
                                            className='mt-3'
                                            options={option} 
                                            value={collaborators}
                                            onChange={handleSelect}
                                            placeholder="Seleccione usuario"
                                         />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='jefe'className="text-gray-700 uppercase font-bold text-sm">Rol</label>
                                        <Select
                                            id='jefe'
                                            name='jefe'
                                            className='mt-3'
                                            options={optionRoles} 
                                            value={rol}
                                            onChange={handleSelectRol}
                                            placeholder="Seleccione rol"
                                         />
                                    </div>
                                <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-5 gap-2">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                    Agregar</button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={handleModal}
                                        data-autofocus
                                    >Cancelar</button>
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
  )
}

export default OffCanvasAddQA