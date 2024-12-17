'use client'

import { useState,useEffect } from "react"

const InputComparacion = ({label,record,setRecord}) => {

    const [operacion,setOperacion]=useState(record.own[label].operation ? record.own[label].operation : '' )
    const [operacionType,setOperationType]=useState(record.own[label] ? record.own[label].operationType : '')
    const [operationValue1,setOperationValue1]=useState(record.own[label] ? record.own[label].value1 : '')
    const [operationValue2,setOperationValue2]=useState(record.own[label] ? record.own[label].value2 : '')

    useEffect(()=>{
            if(operacionType==='campo'){
                    const updatedOwn = {
                        ...record.own,
                        [label]: {
                        ...record.own[label],
                        value1: operationValue1,
                        value2:operationValue2,
                        field: record.own[label]?.field ? record.own[label]?.field : '' // aquí se usa 'value' en vez de 'type' para usar el valor pasado como argumento
                        }
                    };
                    // Actualizar el record con el nuevo objeto own actualizado
                    setRecord({
                        ...record,
                        own: updatedOwn
                    });
            }
            if(operacionType==='valor'){
                if(operacion!=='entre'){
                    const updatedOwn = {
                        ...record.own,
                        [label]: {
                        ...record.own[label],
                        value1: operationValue1,
                        value2:'' // aquí se usa 'value' en vez de 'type' para usar el valor pasado como argumento
                        }
                    }
                    // Actualizar el record con el nuevo objeto own actualizado
                    setRecord({
                        ...record,
                        own: updatedOwn
                    });
                };
                if(operacion==='entre'){
                    const updatedOwn = {
                        ...record.own,
                        [label]: {
                        ...record.own[label],
                        value1: operationValue1,
                        value2: operationValue2 // aquí se usa 'value' en vez de 'type' para usar el valor pasado como argumento
                        }
                    }
                    // Actualizar el record con el nuevo objeto own actualizado
                    setRecord({
                        ...record,
                        own: updatedOwn
                    });
                };

            }
    },[operationValue1,operationValue2])

    const handleOperacion=(value)=>{
        if(record.own[label].operation !== value){
                setOperationValue1('')
                setOperationValue2('')
                setOperacion(value)
                // Clonar el objeto record y actualizar la propiedad operationType
                const updatedOwn = {
                        ...record.own,
                        [label]: {
                        ...record.own[label],
                        operation: value // aquí se usa 'value' en vez de 'type' para usar el valor pasado como argumento
                        }
                };
                // Actualizar el record con el nuevo objeto own actualizado
                setRecord({
                    ...record,
                    own: updatedOwn
                });
        }
    }

    const handleOperationType=(value)=>{
        if(record.own[label].operation !== value){
                setOperationValue1('')
                setOperationValue2('')
                setOperationType(value)
                // Clonar el objeto record y actualizar la propiedad operationType
                const updatedOwn = {
                    ...record.own,
                    [label]: {
                        ...record.own[label],
                        operationType: value ,
                        value1:'',
                        value2:''// aquí se usa 'value' en vez de 'type' para usar el valor pasado como argumento
                    }
                };
                // Actualizar el record con el nuevo objeto own actualizado
                setRecord({
                    ...record,
                    own: updatedOwn
                });
        }
    }

  return (
    <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-2 w-1/2">
            <label htmlFor={`operacion_${label}`}>
                Operación
            </label>
            <select
                id={`operacion_${label}`}
                name={`operacion_${label}`}
                value={operacion || ''}
                onChange={e=>handleOperacion(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
                <option value=''>Seleccionar...</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
                <option value="=">=</option>
                <option value='entre'>entre</option>
            </select>
        </div>
        <div className="flex items-center gap-2 w-1/2">
                <label htmlFor={`operationType_${label}`}>
                    Contra
                </label>
                <select
                    id={`operationType_${label}`}
                    name={`operationType_${label}`}
                    value={operacionType}
                    onChange={e=>handleOperationType(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    <option value="">Elige...</option>
                    <option value='valor'>valor</option>
                    <option value='campo'>campo</option>
                </select>
        </div>
        {(operacion==='entre' && operacionType==='valor') 
                    ?
                        (
                          <div className="flex items-center gap-2 col-span-1">
                                <div className="flex items-center gap-2 col-span-1">
                                        <label htmlFor={`operationValue1_${label}`}>Valor inferior:</label>
                                        <input
                                                type="text"
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                                id={`operationValue1_${label}`}
                                                name={`operationValue1_${label}`}
                                                value={operationValue1}
                                                onChange={(event) => {
                                                const inputValue = event.target.value;
                                                                                                                                          
                                                if (/^\d*\.?\d*$/.test(inputValue)) {
                                                setOperationValue1(inputValue);
                                            }}}
                                        />
                                </div>
                                <div className="flex items-center gap-2 col-span-1">
                                        <label htmlFor={`operationValue2_${label}`}>Valor inferior:</label>
                                        <input
                                                type="text"
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                                id={`operationValue2_${label}`}
                                                name={`operationValue2_${label}`}
                                                value={operationValue2}
                                                onChange={(event) => {
                                                const inputValue = event.target.value;
                                                                                                                                          
                                                if (/^\d*\.?\d*$/.test(inputValue)) {
                                                setOperationValue2(inputValue);
                                            }}}
                                        />
                                </div>
                          </div>
                        )
                    :
                        ((operacion!=='' && operacion!=='entre' && operacionType!=='campo') && 
                                    (
                                        <div className="flex items-center gap-2 col-span-1">
                                            <div className="flex items-center gap-2 col-span-1">
                                                <label htmlFor={`operationValue1_${label}`}>Valor:</label>
                                                <input
                                                        type="text"
                                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                                        id={`operationValue1_${label}`}
                                                        name={`operationValue1_${label}`}
                                                        value={operationValue1}
                                                        onChange={(event) => {
                                                        const inputValue = event.target.value;
                                                                                                                                                
                                                        if (/^\d*\.?\d*$/.test(inputValue)) {
                                                        setOperationValue1(inputValue);
                                                    }}}
                                                />
                                            </div>
                                        </div>
                                    )
                            
                        )       
            
        }
    </div>
  )
}

export default InputComparacion