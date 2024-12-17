'use  client'
import { getRolesAction, setDocumentAccessAction } from '@/app/_actions';
import { useSession } from 'next-auth/react';
import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon,TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Select from 'react-select';

const OffCanvasAddAccess = ({open,setOpen,document}) => {

    const { data: session } = useSession();
    const [selectedRole, setSelectedRole] = useState(null); // Nuevo estado para el rol seleccionado
    const [selectedPermission, setSelectedPermission] = useState(null); // Nuevo estado para el permiso seleccionado
    const [accessList, setAccessList] = useState([]); // Lista de acceso para múltiples roles y permisos
    const [option, setOption] = useState([]);
    const lectureOption = [
      { value: 'read', label: 'Lectura' },
      { value: 'write', label: 'Escritura' },
      { value: 'admin', label: 'Admin' },
    ];
    const [msg, setMsg] = useState('');
  

    useEffect(() => {
        if (open) {
          // Inicializar accessList con document.access y ajustar las opciones
          setAccessList(document.access.map(access => ({
            role: { value: access.role, label: access.role.name }, // Debes obtener el nombre del rol desde algún lugar
            permission: { value: access.permissionLevel, label: access.permissionLevel },
          })));
          
          const fetchRoles = async () => {
            const data = await getRolesAction(session?.user?.organization);
            const rolesSet = new Set(data?.roles?.map(rol => JSON.stringify({
              value: rol._id,
              label: rol.name
            })));
            const uniqueRoles = Array.from(rolesSet).map(rol => JSON.parse(rol));
    
            // Filtrar roles ya presentes en accessList
            const availableRoles = uniqueRoles.filter(role => !accessList.some(access => access.role.value._id === role.value));
    
            setOption(availableRoles); 
          };
          fetchRoles();
        }
      }, [open, document.access]);
  
    const handleModal = () => {
      setSelectedRole(null);
      setSelectedPermission(null);
      setAccessList([]);
      setOpen(false);
    };
  
    const handleAddAccess = () => {
        if (selectedRole && selectedPermission) {
          setAccessList([...accessList, { role: selectedRole, permission: selectedPermission }]);
          // Eliminar el rol seleccionado de las opciones
          setOption(option.filter(role => role.value !== selectedRole.value));
          setSelectedRole(null);
          setSelectedPermission(null);
        } else {
          setMsg('Por favor, selecciona un rol y un permiso.');
        }
      };
    

      const handleRemoveAccess = (index) => {
        const removedRole = accessList[index].role;
        setAccessList(accessList.filter((_, i) => i !== index));
        setOption([...option, removedRole]); // Agregar de vuelta el rol a las opciones
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const preparedAccessList = accessList.map(access => ({
        role: access.role.value, // Asegúrate de usar el valor (ID) del rol
        permissionLevel: access.permission.value,
      }));
      
      const response = await setDocumentAccessAction(document._id,preparedAccessList)
      if(response.status===200){
            toast(`${response.message}`, {
                theme: 'dark',
                type: 'success',
                autoClose: 2000
            })
            setTimeout(()=>{
                    setOpen(false)
            },2500)
      }
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
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Otorgar Accesos al Documento</Dialog.Title>
                        
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
                                <div className="flex items-center mb-4 justify-between mr-5 mb-5"> {/* Agregamos justify-between */}
                                    <div className="flex gap-2 w-full"> {/* Contenedor para los selects */}
                                        <Select
                                        options={option}
                                        value={selectedRole}
                                        onChange={setSelectedRole}
                                        placeholder="Rol"
                                        className="w-full" // Ocupa todo el ancho disponible
                                        />
                                        <Select
                                        options={lectureOption}
                                        value={selectedPermission}
                                        onChange={setSelectedPermission}
                                        placeholder="Nivel de permiso"
                                        className="w-full" // Ocupa todo el ancho disponible
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddAccess}
                                        className="rounded-md bg-blue-600 px-3 py-2 ml-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {accessList.map((access, index) => (
                                    <div key={index} className="flex items-center justify-between mb-2 mr-5">
                                    <span className="mr-2">{access.role.label}</span> - <span>{access.permission.label}</span>
                                    <button type="button" onClick={() => handleRemoveAccess(index)}>
                                        <TrashIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" aria-hidden="true" />
                                    </button>
                                    </div>
                                ))}
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

export default OffCanvasAddAccess