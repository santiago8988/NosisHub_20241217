'use client'

import { Fragment, useEffect, useState } from "react"

const NewRecordAddComparison = ({record,setRecord,comparisonField}) => {
    
    const [selectedField, setSelectedField] = useState(record.own[comparisonField] ?  record.own[comparisonField].field : '');
    const [selectedValue,setSelectedValue] = useState(record.own[comparisonField] ?  record.own[comparisonField].value1 : '');
    const [selectedValue2,setSelectedValue2]=useState(record.own[comparisonField] ?  record.own[comparisonField].value2 : '');
    const [fields,setFields]=useState([])
    const [fieldsValue,setFieldsValue]=useState([])
    const [fieldsValue2,setFieldsValue2]=useState([])
   
    /*const [selectedField, setSelectedField] = useState('' );
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedValue2, setSelectedValue2] = useState('');
    const [fields, setFields] = useState([]);
    const [fieldsValue, setFieldsValue] = useState([]);
    const [fieldsValue2, setFieldsValue2] = useState([]);


    useEffect(() => {
        if (record) {
            const ownData = record.own[comparisonField];
            console.log('comparisonField',comparisonField)
            console.log('ownData',ownData)
            setSelectedField(ownData ? ownData.field : '');
            setSelectedValue(ownData ? ownData.value1 : '');
            setSelectedValue2(ownData ? ownData.value2 : '');
        }
    }, [record, comparisonField]);*/

    useEffect(()=>{
        if (record) {
          const fields = [];
          Object.keys(record.own).forEach(key => {
            const campo = record.own[key];
            if (key !== comparisonField && (campo.tipo === 'number' || campo.tipo === 'formula' || campo.tipo === 'comparacion')) {
              fields.push(key);
            }
            if (key !== comparisonField && campo.tipo === 'entradaRelacionada') {
              campo.fieldsToWrite.forEach(field => {
                if (['number', 'formula', 'comparacion'].includes(field.value.tipo)) {
                  fields.push(`${key}.${field.label}`);
                }
              });
            }
          });
          setFields(fields);

        if(selectedValue !==undefined && selectedValue!==''){
          const initialValues = fields.filter(field => field !== selectedField);
          setFieldsValue(initialValues);
          if(selectedValue2!==undefined && selectedValue2!==''){
            const initialValues2 = initialValues.filter(field => field !== selectedValue);
            setFieldsValue2(initialValues2);
          }
        }
        }
        
    },[])

    useEffect(()=>{
        const updatedRecord = { ...record };
        
        if(updatedRecord.own[comparisonField].operationType!=='campo'){
            updatedRecord.own[comparisonField].field = selectedField;
        }
        if(updatedRecord.own[comparisonField].operationType==='campo'){
            updatedRecord.own[comparisonField].field = selectedField;
            updatedRecord.own[comparisonField].value1=selectedValue
            if(updatedRecord.own[comparisonField].operation==='entre'){
              updatedRecord.own[comparisonField].value2=selectedValue2
            }
        }
        setRecord(updatedRecord)

    },[selectedField,selectedValue,selectedValue2])

    const returnCompareField = (record) => {
        if (record && record.own) {
          for (const key in record.own) {
            if (record.own.hasOwnProperty(key) && record.own[key].tipo === 'comparacion') {
              return key;
            }
          }
        }
      };

      const handleCheckboxChange = (selection) => {
        setFieldsValue([])
        setFieldsValue2([])
        /*setSelectedValue('')
        setSelectedValue2('')*/
          setSelectedField(selection);
          /*const filteredValues=Object.keys(record.own).filter(key=>{
            const campo = record.own[key];
            if(key!==comparisonField && (campo.tipo==='number' || campo.tipo==='formula' || campo.tipo==='comparacion')){
              if(selectedField!=='' && key!==selection){
                return key
              }
            }
          })*/
          const fields = [];
          Object.keys(record.own).forEach(key => {
            const campo = record.own[key];
            if (key !== comparisonField && (campo.tipo === 'number' || campo.tipo === 'formula' || campo.tipo === 'comparacion')) {
              fields.push(key);
            }
            if (key !== comparisonField && campo.tipo === 'entradaRelacionada') {
              campo.fieldsToWrite.forEach(field => {
                if (['number', 'formula', 'comparacion'].includes(field.value.tipo)) {
                  fields.push(`${key}.${field.label}`);
                }
              });
            }
          });
          const filterValues=fields.filter(field=> field!==selection)
          setFieldsValue(filterValues)
          /*setFieldsValue(filteredValues)*/ // Establecer el campo seleccionado
        };
  
        const handleCheckboxChangeValues = (campoValues) => {
          setFieldsValue2([])
          /*setSelectedValue2('')*/
          setSelectedValue(campoValues);
          const filteredValues2=Object.keys(record.own).filter(key=>{
            const campo = record.own[key];
            if(key!==comparisonField && (campo.tipo==='number' || campo.tipo==='formula' || campo.tipo==='comparacion')){
              if(selectedField!=='' && key!==campoValues && key!==selectedField){
                return key
              }
            }
          })
          setFieldsValue2(filteredValues2)
          
        };
        const handleCheckboxChangeValues2 = (campoValues2) => {
          setSelectedValue2(campoValues2);
          
        };

  return (
    <Fragment>
        {record.own[comparisonField].operationType!=='campo' &&
                (
                    <div className="col-span-12 mb-6 mt-6">
                        <div className="bg-white shadow-md rounded-lg">
                            <div className="border-b px-4 py-2">
                                <h4 className="mb-0">CAMPO: {comparisonField}
                                    {/* <span> {record?.own[returnCompareField(record)].operation} {record?.own[returnCompareField(record)].value1}</span>
                                    <span>{record?.own[returnCompareField(record)].operation === 'entre'? ` y ${record?.own[returnCompareField(record)].value2}` : ''}</span> */}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    * Donde se escribirá el resultado de la comparación entre el campo que va a seleccionar y la operación
                                </p>
                            </div>
                            <div className="p-4">
                                <div className="flex">
                                    <div className="w-1/2">
                                        <div><h4 className="mb-2">Campo que se compara:</h4></div>
                                        <div>
                                            {fields.map((campo) => (
                                                <div key={campo} className="mb-2">
                                                    <label htmlFor={campo} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={campo}
                                                            name={campo}
                                                            checked={selectedField === campo}
                                                            onChange={() => handleCheckboxChange(campo)}
                                                            className="mr-2"
                                                        />
                                                        {campo}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div><h5 className="mb-2">Datos de la comparación:</h5></div>
                                        <div><label className="block">Operación: {record?.own[returnCompareField(record)]?.operation}</label></div>
                                        <div><label className="block">Valor: {record?.own[returnCompareField(record)]?.value1}</label></div>
                                        {record?.own[returnCompareField(record)]?.operation === 'entre' && (
                                            <div><label className="block">Valor: {record?.own[returnCompareField(record)]?.value2}</label></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

        }
        {record.own[comparisonField].operationType === 'campo' && (
            <div className="col-span-12 mb-6 mt-6">
                <div className="bg-white shadow-md rounded-lg">
                    <div className="border-b px-4 py-2">
                        <h4 className="mb-0">Nombre del Campo: {comparisonField}</h4>
                        <p className="text-sm text-gray-500" id="periodicityHelpBlock">
                            * Donde se escribirá el resultado de la comparación entre el campo que va a seleccionar contra el valor de otro campo que también seleccionará.
                        </p>
                    </div>
                    <div className="p-4">
                        <div className="flex">
                            <div className="w-1/2">
                                <div><h4 className="mb-2">Campo que se compara:</h4></div>
                                <div>
                                    {fields.length > 0 && fields.map((campo) => (
                                        <div key={campo} className="mb-2">
                                            <label htmlFor={campo} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={campo}
                                                    name={campo}
                                                    checked={selectedField === campo}
                                                    onChange={() => handleCheckboxChange(campo)}
                                                    className="mr-2"
                                                />
                                                {campo}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div><h4 className="mb-2">Valor contra el que se compara:</h4></div>
                                <div>
                                    {fieldsValue.length > 0 && fieldsValue.map((campoValue) => (
                                        <div key={campoValue} className="mb-2">
                                            <label htmlFor={campoValue} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={campoValue}
                                                    name={campoValue}
                                                    checked={selectedValue === campoValue}
                                                    onChange={() => handleCheckboxChangeValues(campoValue)}
                                                    className="mr-2"
                                                />
                                                {campoValue}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {record.own[comparisonField].operation === 'entre' && (
                                <div className="w-1/2">
                                    <div><h4 className="mb-2">Valor contra el que se compara:</h4></div>
                                    <div>
                                        {fieldsValue2.length > 0 && fieldsValue2.map((campoValue2) => (
                                            <div key={campoValue2} className="mb-2">
                                                <label htmlFor={campoValue2} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={campoValue2}
                                                        name={campoValue2}
                                                        checked={selectedValue2 === campoValue2}
                                                        onChange={() => handleCheckboxChangeValues2(campoValue2)}
                                                        className="mr-2"
                                                    />
                                                    {campoValue2}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Fragment>
  )
}

export default NewRecordAddComparison