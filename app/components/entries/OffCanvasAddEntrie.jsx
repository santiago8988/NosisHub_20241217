'use client';
import { Fragment, useState,useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { createNextEntrie, changeNextField, executeAction, createEntryAction } from '@/app/_actions';
import InputForm from '@/app/components/entries/InputForm';
import { toast } from 'react-toastify';
import { convertFileToBase64 } from '@/lib/utils/utils';

const OffCanvasAddEntrie = ({ open, setOpen,initialRecord }) => {

    const { id } = useParams();
    const { data: session } = useSession();
    const [record, setRecord] = useState(initialRecord ? initialRecord : {});
    const [alerta, setAlerta] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formulasToCalculate, setFormulasToCalculate] = useState([]);
    const [updatedFormObject, setUpdatedFormObject] = useState({});
    const formRef = useRef(null);
    const [formValues, setFormValues] = useState({});
    const [file, setFile] = useState('');
  
        useEffect(() => {
        if (record) {
            const { own } = record;
            own && typeof own === 'object' && Object.keys(own).map((campo) => {
            if (own[campo].tipo === 'formula') {
                setFormulasToCalculate((prevFormulas) => ({
                ...prevFormulas,
                [campo]: own[campo],
                }));
            }
            });
        }
    
        if (record && record.own && typeof record.own === 'object') {
            const updatedInitialState = {};
    
            for (const campo in record.own) {
            if (record.own.hasOwnProperty(campo)) {
                updatedInitialState[campo] = '';
            }
            }
            setFormValues(updatedInitialState);
        }
        }, [record]);
    
        const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        };
    
        const validateFormObject = (formObject) => {
        for (const key in formObject) {
            if (formObject.hasOwnProperty(key)) {
            const value = formObject[key];
            if (typeof value !== 'object' && !(value instanceof File)) {
                if (value.trim() === '') {
                return false; // Encontramos un campo vacío, la validación falla
                }
            }
            }
        }
        return true; // Todos los campos están llenos, la validación es exitosa
        };
    
        const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        if (file && file.type !== 'application/pdf') {
            setAlerta({
            msg: 'El archivo debe ser PDF',
            error: true,
            });
            setTimeout(() => {
            setAlerta({});
            }, 3000);
            return;
        }
    
        const form = formRef.current;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
    
        const isValid = validateFormObject(formObject);
    
        if (isValid) {
            const newValues = { ...record.own };
            Object.keys(newValues).map(field => {
            if (newValues[field].tipo === 'entradaRelacionada') {
                let newObject = {};
                newValues[field].fieldsToWrite.map((fieldInside, index) => {
                newObject[fieldInside.label] = formObject[`${field}_${fieldInside.label}`];
                });
                newValues[field] = newObject;
            } else {
                newValues[field] = formObject[field];
            }
            });
    
            let base64 = null;
            if (file) {
            const formData = new FormData();
            formData.set('file', file);
            base64 = await convertFileToBase64(formData.get('file'));
            }
            setIsLoading(true);
            const entrie = {
            record: id,
            dueDate: formObject.FECHA,
            createdBy: session?.user?.email,
            values: newValues,
            completed: true,
            pdf: base64,
            completedBy: session?.user?.email,
            organization:session?.user?.organization,
            };
    
            const response = await createEntryAction(entrie, record);
    
            if (response && response._id) {
            toast('Entrada creada.', {
                theme: 'dark',
                type: 'success',
                autoClose: 1500,
            });
            if (actions.length > 0) {
                const responseAction = await executeAction(actions, formObject);
                if (responseAction.every(action => action.success && action.error === "")) {
                toast('Actions executed successfully.', {
                    theme: 'colored',
                    type: 'success',
                    autoClose: 1500,
                });
                } else {
                toast('The creation of some action has failed', {
                    theme: 'colored',
                    type: 'error',
                    autoClose: 1500,
                });
                }
            }
    
            if (type !== 'NOT PERIODIC' && !response.nextCreated) {
                const newEntrie = await createNextEntrie(entrie, identifier, periodicity, type);
                if (newEntrie && newEntrie._id) {
                toast('Your next entrie has been created successfully.', {
                    theme: 'dark',
                    type: 'success',
                    autoClose: 1500,
                });
                const { state } = await changeNextField(response._id);
                if (state === 200) {
                    toast('Your entrie has been updated successfully.', {
                    theme: 'dark',
                    type: 'success',
                    autoClose: 1500,
                    });
                }
                }
            }
            setTimeout(() => {
                setIsLoading(false);
                handleClose();
            }, 2500);
            } else {
            toast(`${response?.msg}`, {
                theme: 'colored',
                type: 'error',
                autoClose: 1500,
            });
            setIsLoading(false);
            return;
            }
        } else {
            setAlerta({
            msg: 'Todos los campos son obligatorios',
            error: true,
            });
            setTimeout(() => {
            setAlerta({});
            }, 3000);
        }
        };
    
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
    
        const { msg } = alerta;
        const { own, name, code, type, periodicity, identifier, actions } = record;

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
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">Agregar entrada</Dialog.Title>
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

                      <form ref={formRef} onSubmit={handleFormSubmit}>
                            <div className="space-y-4">
                            {own && typeof own === 'object' && Object.keys(own).map((campo) => {
                                const fieldValue = updatedFormObject[campo] || '';
                                return (
                                <div key={campo} className="mb-4">
                                    <InputForm
                                        campo={own[campo]}
                                        label={campo}
                                        type={own[campo].tipo}
                                        action={"creating"}
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
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    disabled={isLoading}
                                >{isLoading ? 'Creando...' : 'Crear'}</button>
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

export default OffCanvasAddEntrie;
