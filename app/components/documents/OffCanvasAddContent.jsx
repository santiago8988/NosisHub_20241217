'use  client'
import { addParagraphAction, editParagraphAction } from '@/app/_actions';
import { useSession } from 'next-auth/react';
import { useState, useEffect, Fragment,useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon,TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { convertFileToBase64 } from '@/lib/utils/utils';
import Image from 'next/image';


const OffCanvasAddContent = ({open,setOpen,initialParagraph,documentid,documentStatus}) => {

    const { data: session } = useSession();
    const [msg, setMsg] = useState('');
    const idDocumentRef = useRef(documentid ? documentid : null)
    const titleRef = useRef(initialParagraph!==null ? initialParagraph.title : '');
    const paragraphRef = useRef(initialParagraph!==null ? initialParagraph.body : '');
    const idParagraphRef = useRef(initialParagraph!==null ? initialParagraph.idparagraph : '')
    const imageRef=useRef(initialParagraph!==null ? initialParagraph.image : null)
    const [file, setFile] = useState('');
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(()=>{
        if (imageRef.current && !imageSrc) {
            setImageSrc(imageRef.current);
          }
    },[])
  
    const handleModal = () => {
      /*setSelectedRole(null);
      setSelectedPermission(null);
      setAccessList([]);*/
      setOpen(false);
    };
  
   
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const titleValue=titleRef.current.value;
        const paragraphValue = paragraphRef.current.value;
        
        
        let response;
        let base64 = null;
        if(file){
            const formData = new FormData();
            formData.set('file', file);
            base64 = await convertFileToBase64(formData.get('file'))
        }
        
        const paragraph={
            title:titleValue,
            body:paragraphValue,
            image:base64 ,
            addedBy: session?.user?.email
        }

        if(initialParagraph!==null){
            response = await editParagraphAction(paragraph,idDocumentRef.current,initialParagraph._id)
        }else{
            response = await addParagraphAction(paragraph,documentid)
        }
        console.log(response)
        if(response && response.status === 200){

            toast(`${response.msg}`, {
                theme: 'colored',
                type: 'success',
                autoClose: 2000
            })
        }else{
            toast(`${response.msg}`, {
                theme: 'colored',
                type: 'error',
                autoClose: 2000
            })
        }
        setOpen(false)
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      };



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
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Agregar contenido al Documento</Dialog.Title>
                        
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
                                <div className="border rounded-lg shadow-sm">
                                   <div className="border-b p-6">
                                      <div className="flex justify-between items-center">
                                         <div>
                                            {documentStatus !== 'approved' ? (
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    defaultValue={initialParagraph!==null ? initialParagraph.title : ''}
                                                    ref={titleRef} 
                                                />
                                                </div>
                                                <div>
                                                <label htmlFor="paragraph" className="block text-sm font-medium text-gray-700">
                                                    Párrafo
                                                </label>
                                                <textarea
                                                    cols={70}
                                                    rows={10}
                                                    name="paragraph"
                                                    id="paragraph"
                                                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    defaultValue={initialParagraph!==null ? initialParagraph.body : ''}
                                                    ref={paragraphRef} 
                                                />
                                                </div>
                                                <label htmlFor="formFile" className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                                                    Imagen
                                                </label>
                                                {imageSrc && (
                                                <div className='mb-3'>
                                                    <Image src={imageSrc} alt="Vista previa de la imagen" width={300} height={150}  onError={() => setImageSrc(null)} />
                                                </div>
                                                )}
                                                <div>
                                                <input 
                                                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                                    id="formFile" 
                                                    type="file" 
                                                    onChange={handleFileChange} 
                                                />
                                                </div>
                                                <div className="bg-white px-3 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-5 gap-2">
                                                    <button
                                                        type="submit"
                                                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                    >
                                                    Finalizar</button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={handleModal}
                                                        data-autofocus
                                                    >Cancelar</button>
                                                </div>
                                            </form>
                                            ) : (
                                            <div>
                                                <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" // Fondo gris claro para readOnly
                                                    defaultValue={initialParagraph!==null ? initialParagraph.title : ''}
                                                    readOnly
                                                />
                                                </div>
                                                <div>
                                                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                                                    Párrafo
                                                </label>
                                                <textarea
                                                    cols={70}
                                                    rows={10}
                                                    name="body"
                                                    id="body"
                                                    className="mt-1 p-2 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" // Fondo gris claro para readOnly
                                                    value={initialParagraph!==null ? initialParagraph.body : ''}
                                                    readOnly
                                                />
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                        </div>
                                    </div>
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
  )
}

export default OffCanvasAddContent