'use client';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const OffCanvasImportEntrys = ({ open, setOpen, onClose, record, initialRecord }) => {
    const [importPreviousEntries, setImportPreviousEntries] = useState(false);
    const [fieldMappings, setFieldMappings] = useState({});
    const [availableFields, setAvailableFields] = useState([]);

    // Reset states when modal opens
    useEffect(() => {
        if (open && initialRecord?.own) {
            setFieldMappings({});
            setAvailableFields(Object.keys(initialRecord.own));
            setImportPreviousEntries(false);
        }
    }, [open, initialRecord]);

    const handleFieldMapping = (currentField, selectedInitialField) => {
        // Remove previous mapping if exists
        const previousMapping = fieldMappings[currentField];
        
        setFieldMappings(prev => {
            const newMappings = { ...prev };
            if (selectedInitialField === "") {
                delete newMappings[currentField];
            } else {
                newMappings[currentField] = selectedInitialField;
            }
            return newMappings;
        });

        // Update available fields
        setAvailableFields(prev => {
            let newAvailable = [...prev];
            // If there was a previous mapping, add it back to available fields
            if (previousMapping) {
                newAvailable.push(previousMapping);
            }
            // If a new field was selected, remove it from available fields
            if (selectedInitialField) {
                newAvailable = newAvailable.filter(field => field !== selectedInitialField);
            }
            return newAvailable.sort();
        });
    };

    const getSelectableFields = (currentField) => {
        // Get all initial fields except those already mapped (excluding current field's mapping)
        const mappedFields = Object.entries(fieldMappings)
            .filter(([key]) => key !== currentField)
            .map(([_, value]) => value);
        
        return Object.keys(initialRecord?.own || {}).filter(
            field => !mappedFields.includes(field)
        );
    };

    const handleImport = () => {
        const allFieldMappings = { ...fieldMappings };
    
        // Incluir campos no mapeados con valor vacío
        Object.keys(record.own).forEach(field => {
            if (!allFieldMappings[field]) {
                allFieldMappings[field] = "";
            }
        });

        onClose(true, allFieldMappings);
        setOpen(false);
    };

    const handleCancel = () => {

      onClose(false, {});
      setOpen(false);
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
                                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                Importar campos de la versión anterior
                                            </Dialog.Title>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex items-start sm:items-center mb-6">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Nueva versión
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            ¿Desea importar los registros de la versión anterior?
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {record?.own && (
                                                <div className="mt-4">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Mapeo de campos</h4>
                                                    <div className="space-y-4">
                                                        {Object.keys(record.own).map((field) => (
                                                            <div key={field} className="flex flex-col">
                                                                <label
                                                                    htmlFor={`field-${field}`}
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
                                                                    {field}
                                                                </label>
                                                                <select
                                                                    id={`field-${field}`}
                                                                    value={fieldMappings[field] || ""}
                                                                    onChange={(e) => handleFieldMapping(field, e.target.value)}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                >
                                                                    <option value="">Seleccionar campo</option>
                                                                    {getSelectableFields(field).map((option) => (
                                                                        <option key={option} value={option}>
                                                                            {option}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-5">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={() => setImportPreviousEntries(true)}
                                                >
                                                    Importar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                            
                                            {importPreviousEntries && (
                                                <div className="mt-5">
                                                    <button
                                                        type="button"
                                                        className="w-full inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        onClick={handleImport}
                                                    >
                                                        Confirmar importación
                                                    </button>
                                                </div>
                                            )}
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

export default OffCanvasImportEntrys;




/*'use client';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const OffCanvasImportEntrys = ({ open, setOpen, onClose, record, initialRecord }) => {
    const [importPreviousEntries, setImportPreviousEntries] = useState(false);
    const [fieldMappings, setFieldMappings] = useState({});
    const [availableFields, setAvailableFields] = useState([]);

    // Reset states when modal opens
    useEffect(() => {
        if (open && initialRecord?.own) {
            setFieldMappings({});
            setAvailableFields(Object.keys(initialRecord.own));
            setImportPreviousEntries(false);
        }
    }, [open, initialRecord]);

    const handleFieldMapping = (currentField, selectedInitialField) => {
        // Remove previous mapping if exists
        const previousMapping = fieldMappings[currentField];
        
        setFieldMappings(prev => {
            const newMappings = { ...prev };
            if (selectedInitialField === "") {
                delete newMappings[currentField];
            } else {
                newMappings[currentField] = selectedInitialField;
            }
            return newMappings;
        });

        // Update available fields
        setAvailableFields(prev => {
            let newAvailable = [...prev];
            // If there was a previous mapping, add it back to available fields
            if (previousMapping) {
                newAvailable.push(previousMapping);
            }
            // If a new field was selected, remove it from available fields
            if (selectedInitialField) {
                newAvailable = newAvailable.filter(field => field !== selectedInitialField);
            }
            return newAvailable.sort();
        });
    };

    const getSelectableFields = (currentField) => {
        // Get all initial fields except those already mapped (excluding current field's mapping)
        const mappedFields = Object.entries(fieldMappings)
            .filter(([key]) => key !== currentField)
            .map(([_, value]) => value);
        
        return Object.keys(initialRecord?.own || {}).filter(
            field => !mappedFields.includes(field)
        );
    };

    const handleImport = () => {
        onClose(true, fieldMappings);
        setOpen(false);
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
                                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                Importar campos de la versión anterior
                                            </Dialog.Title>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex items-start sm:items-center mb-6">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Nueva versión
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            ¿Desea importar los registros de la versión anterior?
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {record?.own && (
                                                <div className="mt-4">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Mapeo de campos</h4>
                                                    <div className="space-y-4">
                                                        {Object.keys(record.own).map((field) => (
                                                            <div key={field} className="flex flex-col">
                                                                <label
                                                                    htmlFor={`field-${field}`}
                                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                                >
                                                                    {field}
                                                                </label>
                                                                <select
                                                                    id={`field-${field}`}
                                                                    value={fieldMappings[field] || ""}
                                                                    onChange={(e) => handleFieldMapping(field, e.target.value)}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                >
                                                                    <option value="">Seleccionar campo</option>
                                                                    {getSelectableFields(field).map((option) => (
                                                                        <option key={option} value={option}>
                                                                            {option}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-5">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={() => setImportPreviousEntries(true)}
                                                >
                                                    Importar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                            
                                            {importPreviousEntries && Object.keys(fieldMappings).length > 0 && (
                                                <div className="mt-5">
                                                    <button
                                                        type="button"
                                                        className="w-full inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        onClick={handleImport}
                                                    >
                                                        Confirmar importación
                                                    </button>
                                                </div>
                                            )}
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

export default OffCanvasImportEntrys;*/




