'use client';
import { Fragment, useState,useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select'
import { useSession } from 'next-auth/react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { createUserAction } from '@/app/_actions';
import { toast } from 'react-toastify';


const OffCanvasAddUser = ({ open, setOpen,organizationAreas,organizationPositions }) => {

    const {data: session} = useSession();
    const [msg, setMsg] = useState('')
    const [fullName,setFullName] = useState('');
    const [email,setEmail] = useState('');
    const [mobileValue, setMobileValue] = useState('')
    const [role,setRole] = useState('');
    const [area,setArea] = useState('');
    const [userId,setUserId]= useState('')
    const [option,setOption]=useState([])
    const [positions,setPositions]=useState([])
    /*const [areas,setAreas]=useState([])*/

    useEffect(() =>{
        if(open){
            const options2=[];
            organizationPositions.map(position=>{
                const newOpt={
                    value:position.name,
                    label:position.name
                }
                options2.push(newOpt)
            })
            setOption(options2)
        }
      }, [open])


     const handleModal=()=>{
        setFullName('')
        setEmail('')
        setMobileValue('')
        setRole('')
        setArea('')
        setUserId('')
        setOption([])
        setPositions([])
        /*setAreas([])*/
        setOpen(false)
     }

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const positionsValue = positions.map((position)=>(position.value))
        /*if([formData.get('userName'),formData.get('userEmail'),mobileValue,formData.get('userRole'),formData.get('userArea')].includes('') && positionsValue.length>0){
            setMsg('Debe completar todos los campos')
            setTimeout(()=>{
                setMsg('')
            },2500)
            return;
        }*/
        const newUser = {
            fullName: fullName,
            email: email,
            mobile: mobileValue,
            role: role,
            position: positionsValue,
            area: area,
            createdBy: session?.user?.email,
            organization: session?.user?.organization
        }
        const response=await createUserAction(newUser);
        if(response.status===200){
            toast(`${response.msg}`,
                {theme: 'colored',
                  type: 'success',
                  autoClose: 2000})
              setTimeout(()=>{
                  handleModal()
              },2500)
        }else{
            toast(`${response.msg}`,
              {theme: 'colored',
                type: 'error',
                autoClose: 2000})
            setTimeout(()=>{
                handleModal()
            },2500)
        }
    }

    function handleSelect(data) {
        setPositions(data);
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
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Agregar Usuario</Dialog.Title>
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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                Nombre completo
                                </label>
                                <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={fullName}
                                required
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                                Email
                                </label>
                                <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                Celular
                                </label>
                                <PhoneInput
                                id="mobile"
                                placeholder="Enter phone number"
                                value={mobileValue}
                                required
                                onChange={setMobileValue}
                                />
                            </div>
                            <div>
                                <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">
                                Rol
                                </label>
                                <select
                                name="userRole"
                                id="userRole"
                                value={role}
                                required
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                <option value="">Elige</option>
                                <option value="admin">ADMIN</option>
                                <option value="user">USER</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                Cargo
                                </label>
                                <Select
                                options={option}
                                isMulti
                                required
                                value={positions}
                                onChange={handleSelect}
                                className="mt-1" // Añadir clase para margen superior
                                />
                            </div>
                            <div>
                                <label htmlFor="userArea" className="block text-sm font-medium text-gray-700">
                                Área
                                </label>
                                <select
                                name="userArea"
                                id="userArea"
                                value={area}
                                required
                                onChange={(e) => setArea(e.target.value)}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                <option value="">Elige...</option>
                                {organizationAreas.map((area) => (
                                    <option key={area._id} value={area.name}>
                                    {area.name}
                                    </option>
                                ))}
                                </select>
                            </div>
                            <div className="mt-5">
                                <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                {userId ? 'Editar' : 'Agregar'}
                                </button>
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

export default OffCanvasAddUser