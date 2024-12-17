'use client'
import { useState,useEffect, useRef,Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {  inactiveEntrieAction } from '@/app/_actions';
import {  toast } from 'react-toastify'
import ConfirmationModal from '../ui/ConfirmationModal';


const OffCanvasArchiveEntrie = ({ open,setOpen,initialentrie }) => {

    const [comment,setComment] = useState('');
    const [alerta,setAlerta] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [confirm,setConfirm] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(()=>{
            if(confirm){
                setIsLoading(true);
                const inactive = async()=>{
                        const response = await inactiveEntrieAction(initialentrie._id,comment,initialentrie.record._id)
                        if(response.status === 200){
                            toast(`${response.message}`, {
                                theme: 'colored',
                                type: 'success',
                                autoClose: 2000
                            })
                            
                            }else{
                                toast(`${response.message}`, {
                                    theme: 'colored',
                                    type: 'error',
                                    autoClose: 2000
                                })
                            }
                            setTimeout(() => {
                                setOpen(false)
                            }, 2000);
                }
                inactive()
            }
    },[confirm])

    const handleConfirm = () => {
        setConfirm(true)
        setModalShow(false);
      };

      const handleClose = ()=>{
        setOpen(false)
      }

    const handleSubmit = async (e) => {

        e.preventDefault();
        if(comment === ''){
            setAlerta({
                       msg : 'El campo comentario es obligatorio',
                       error:true,})
            setTimeout(()=>{
                        setAlerta({})
                    },3000)
            return
        } 
        setModalShow(true)       
    }

    const {msg} = alerta;


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
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Archivar entrada</Dialog.Title>
                            </div>
                            <div className="border shadow-none rounded-lg overflow-hidden">
                                <div className="border-b p-6">
                                    <form onSubmit={handleSubmit} className="my-10 mx-15">
                                    {msg && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                                        {msg}
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <textarea
                                        id="comment"
                                        className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        rows="3"
                                        placeholder='Escriba motivo...'
                                        onChange={e => setComment(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mt-3 mb-3 mr-5 flex items-center justify-end gap-x-6">
                                        <button 
                                            type="button" 
                                            className="text-sm font-semibold leading-6 text-gray-900"
                                            onClick={handleClose}
                                        > Cancelar</button>
                                        <button
                                            type="submit"
                                            onClick={handleSubmit}  
                                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                            disabled={isLoading}
                                        >{isLoading ? 'Cargando...' : 'Archivar'}</button>
                                    </div>
                                    </form>
                                </div>
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
              title='Archivar entrada'
              message="Si archiva la entrada, esta y todas las que tengan el mismo identificador se archivarán. ¿Está seguro?"
              handleConfirm={handleConfirm}
          />                       
    </Fragment>
  );
};

export default OffCanvasArchiveEntrie;
