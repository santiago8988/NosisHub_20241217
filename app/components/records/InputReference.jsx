'use client'

import { useEffect, useState } from "react"

const InputReference = ({ label, record, setRecord, recordList }) => {
    const [recordReference, setRecordReference] = useState(record.own[label] ? record.own[label].record : '');
    const [fieldReference, setFieldReference] = useState(record.own[label] ? record.own[label].campo : '');
    const [initialValues, setInitialValues] = useState({});
    const [fieldOptions, setFieldOptions] = useState([]);

    useEffect(() => {
        if (Object.keys(record).length > 0 && Object.keys(record.own).length > 0) {
            setInitialValues(record.own[label]);
        }
    }, [record, label]);

    useEffect(() => {
        if (recordReference !== initialValues.record) {
            const ownUpdated = { ...record.own };
            ownUpdated[label].record = recordReference;
            setRecord({ ...record, own: ownUpdated });
        }
        const recordSelected = recordList.find(r => r._id === recordReference);
        if (recordSelected) { 
            const campos = Object.keys(recordSelected.own);
            setFieldOptions(campos);
            if (!campos.includes(fieldReference)) {
                setFieldReference('');
            }
        }
    }, [recordReference, initialValues, record, setRecord, recordList, label, fieldReference]);

    useEffect(() => {
        if (fieldReference !== initialValues.campo) {
            const ownUpdated = { ...record.own };
            ownUpdated[label].campo = fieldReference;
            setRecord({ ...record, own: ownUpdated });
        }
    }, [fieldReference, initialValues, record, setRecord, label]);

    return (
        <div className="flex gap-2 w-full">
            <div className="flex gap-2 w-1/3">
                <label htmlFor={`recordReference_${label}`}>
                    Registro
                </label>
                <select
                    id={`recordReference_${label}`}
                    name={`recordReference_${label}`}
                    value={recordReference}
                    onChange={e => setRecordReference(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    <option value="">Seleccionar...</option>
                    {recordList?.map(record => (
                        <option key={record._id} value={record._id}>{record.name}</option>
                    ))}
                </select>
            </div>
            {fieldOptions.length > 0 && (
                <div className="flex items-center gap-2 w-1/3">
                    <label htmlFor={`fieldReference_${label}`}>
                        Campo
                    </label>
                    <select
                        id={`fieldReference_${label}`}
                        name={`fieldReference_${label}`}
                        value={fieldReference}
                        onChange={e => setFieldReference(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                        <option value="">Elige...</option>
                        {fieldOptions?.map(field => (
                            <option key={field} value={field}>{field}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default InputReference;
