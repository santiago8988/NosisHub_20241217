'use client';
import { Fragment, useState,useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify'
import Select from 'react-select'
import { addCollaboratorsAction, getAllowedUsersAction } from '@/app/_actions'
import { useSession } from 'next-auth/react';

const OffCanvasAddCollaborator = ({ open, setOpen,record }) => {
    const {data:session} = useSession()
    const [collaborators, setCollaborators] = useState([])
    const [option, setOption] = useState([])
    const [msg, setMsg] = useState('')
  
    useEffect(() => {
      const fetchUsers = async () => {
        const  userList  = await getAllowedUsersAction(session?.user?.organization)
        const userSet = new Set(userList.map(user => JSON.stringify({
          value: user._id,
          label: user.email
        })))
  
        const uniqueUsers = Array.from(userSet).map(user => JSON.parse(user))
  
        setOption(uniqueUsers)
      }
      fetchUsers()
    }, [open])


  
    function handleSelect(data) {
      setCollaborators(data)
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      const collaboratorsValue = collaborators.map(collaborator => collaborator.value)
  
      try {
  
        const createdByPresent = collaboratorsValue.includes(record.createdBy._id)   
        const collaboratorsPresent = record?.collaborators.some(collaborator => collaboratorsValue.includes(collaborator._id))
  
        if (createdByPresent || collaboratorsPresent) {
          setMsg('Los colaboradores que quiere agregar ya se encuentran en el registro.')
          setTimeout(() => {
            setMsg('')
          }, 2500)
  
          return
        }
  
        const response = await addCollaboratorsAction(record._id, collaboratorsValue)
  
      } catch (error) {
        toast(`${error.message}`, {
          theme: 'dark',
          type: 'error',
          autoClose: 2000
        })
        setCollaborators([])
      }
      setOpen(false)
    }
  
    const handleModal = () => {
      setCollaborators([])
      setOption([])
      setOpen(false)
    }
  


  return (
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
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Agregar colaboradores</Dialog.Title>
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
                            <div className="mb-4">
                                <Select
                                    options={option}
                                    isMulti
                                    value={collaborators}
                                    onChange={handleSelect}
                                    placeholder="Seleccione colaboradores"/>
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
  );
};

export default OffCanvasAddCollaborator;
