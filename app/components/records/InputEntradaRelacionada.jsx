'use client'

import { getActiveRecordsAction } from "@/app/_actions"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Select from "react-select"

const InputEntradaRelacionada = ({label,record,setRecord}) => {

    const {data:session}=useSession()
    const [recordList, setRecordList] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(record?.own[label] ? record?.own[label].fieldsToWrite : [])
    const [recordReference, setRecordReference] = useState(record?.own[label] ? record?.own[label].record : '')
    const [fieldOptions, setFieldOptions] = useState([])

    useEffect(() => {
        const fetchRecord = async () => {
            const response = await getActiveRecordsAction(session?.user?.organization)
            if (response.status === 200) {
                const sortedRecords = response.records.sort((a, b) => {
                    if (a.name < b.name) return -1
                    if (a.name > b.name) return 1
                    return 0
                })
                setRecordList(sortedRecords)

                // Set initial field options based on the current recordReference
                if (recordReference) {
                    const recordSelected = sortedRecords.find(rec => rec._id === recordReference)
                    if (recordSelected) {
                        const campos = Object.keys(recordSelected.own)
                        const newOptions = campos.map(field => ({
                            value: recordSelected.own[field],
                            label: field
                        }))
                        setFieldOptions(newOptions)
                    }
                }
            }
        }
        fetchRecord()
    }, [recordReference])

    useEffect(() => {
        if (recordReference !== '') {
            const recordSelected = recordList.find(rec => rec._id === recordReference)
            if (recordSelected) {
                const campos = Object.keys(recordSelected.own)
                const newOptions = campos.map(field => ({
                    value: recordSelected.own[field],
                    label: field
                }))
                setFieldOptions(newOptions)
            }
            const ownUpdated = { ...record.own }
            ownUpdated[label].record = recordReference
            setRecord({ ...record, own: ownUpdated })
        }
    }, [recordReference, recordList]) // Added recordList as dependency

    const handleChange = (data) => {
        setSelectedOptions(data)
        const ownUpdated = { ...record.own }
        ownUpdated[label].fieldsToWrite = data
        setRecord({ ...record, own: ownUpdated })
    }

  return (
    <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-0 w-1/2">
            <label htmlFor={`recordEntrieReference_${label}`}>
                Registro
            </label>
            <select
                id={`recordEntrieReference_${label}`}
                name={`recordEntrieReference_${label}`}
                value={recordReference}
                onChange={e=>setRecordReference(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
                <option value="">Seleccionar...</option>
                {recordList?.map(record=>(<option key={record._id} value={record._id}>{record.name}</option>))}
            </select>
        </div>
        <div className="flex items-center gap-2 w-3/4">
            <label htmlFor={`multiReference_${label}`}>
                Campo
            </label>
            <Select
                isMulti
                value={selectedOptions}
                onChange={handleChange}
                options={fieldOptions}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        </div>
    </div>
  )
}

export default InputEntradaRelacionada