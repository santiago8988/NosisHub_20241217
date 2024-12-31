'use client'
import React, { useState, useEffect } from 'react'
import { TrashIcon } from 'lucide-react'

const InputAcciones = ({ record, setRecord, action: initialAction, recordList }) => {
  const [referenciaID] = useState(initialAction.writeOnRecord || '');
  const [referenciaCampos, setReferenciaCampos] = useState([]);
  const [mappings, setMappings] = useState(initialAction.mappings || {});
  const [action, setAction] = useState({ ...initialAction });
  const [selectedFields, setSelectedFields] = useState(initialAction.selectedFields || [...record.identifier]);

  const defaultValue = recordList.find(record => record._id === action.writeOnRecord)?.name || '';
  const [selectedValue, setSelectedValue] = useState('');

  const [tipoCantidad, setTipoCantidad] = useState(initialAction.quantityType || '');
  const [cantidadCampo, setCantidadCampo] = useState(initialAction.quantityField || '');
  const [cantidadNumero, setCantidadNumero] = useState(initialAction.quantityNumber || '');

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setMappings(initialAction.mappings || {});
  }, [initialAction]);

  useEffect(() => {
    setReferenciaCampos([]);
    if (recordList.length > 0 && initialAction.writeOnRecord !== '') {
      const recordSelected = recordList.find(record => record._id === referenciaID);
      if (recordSelected) {
        const campos = Object.keys(recordSelected.own).filter(key => {
          const field = recordSelected.own[key];
          return field.tipo !== 'formula' && field.tipo !== 'referencia';
        });
        setReferenciaCampos(campos);
      }
    }
  }, [initialAction, recordList, referenciaID]);

  useEffect(() => {
    const updatedAction = {
      ...action,
      mappings: mappings,
      selectedFields: selectedFields,
      quantityType: tipoCantidad,
      quantityField: cantidadCampo,
      quantityNumber: cantidadNumero
    };

    setAction(updatedAction);

    const updatedActions = record.actions.map(act =>
      act.actionKey === action.actionKey ? updatedAction : act
    );

    setRecord({
      ...record,
      actions: updatedActions
    });
  }, [mappings, selectedFields, tipoCantidad, cantidadCampo, cantidadNumero]);

  useEffect(() => {
    setSelectedFields(prevFields => {
      const newFields = [...new Set([...prevFields, ...record.identifier])];
      return newFields;
    });
  }, [record.identifier]);

  const onDeleteAction = (event) => {
    event.preventDefault();
    const updatedActions = record.actions.filter(action => {
      return action.actionKey !== initialAction.actionKey;
    });

    setRecord({ ...record, actions: updatedActions });
  };

  const handleMappingChange = (identifier, value) => {
    setMappings(prevMappings => ({
      ...prevMappings,
      [identifier]: value
    }));
  };

  const handleFieldSelection = (field) => {
    if (!record.identifier.includes(field)) {
      setSelectedFields(prevFields => {
        if (prevFields.includes(field)) {
          return prevFields.filter(f => f !== field);
        } else {
          return [...prevFields, field];
        }
      });
      // Limpiar el mapeo si se deselecciona un campo
      if (mappings[field]) {
        handleMappingChange(field, '');
      }
    }
  };

  // Función para obtener los campos disponibles para mapeo
  const getAvailableFields = (currentField) => {
    return referenciaCampos.filter(campo => 
      !Object.values(mappings).includes(campo) || mappings[currentField] === campo
    );
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2"></div>
      <div className="flex justify-end items-start">
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="col-span-3">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full xl:w-1/2 px-3 mb-6 xl:mb-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-3 mb-3">
                <h5 className="text-lg font-medium">Genera la acción</h5>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Registro
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    <input
                      type="text"
                      defaultValue={record.name}
                      readOnly
                      className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Campos a copiar
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    {Object.keys(record.own).map((field) => (
                      <div key={field} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`field-${field}`}
                          checked={selectedFields.includes(field) || record.identifier.includes(field)}
                          onChange={() => handleFieldSelection(field)}
                          disabled={record.identifier.includes(field)}
                          className="mr-2"
                        />
                        <label htmlFor={`field-${field}`} className={`text-sm ${record.identifier.includes(field) ? 'text-gray-500' : ''}`}>
                          {field}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 px-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-3 mb-3">
                <h5 className="text-lg font-medium">Recibe la acción</h5>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Registro
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    <input
                      type="text"
                      defaultValue={selectedValue}
                      readOnly
                      className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                {selectedFields.map((field) => (
                  <div className="flex items-center" key={field}>
                    <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {field}
                      </label>
                    </div>
                    <div className="w-full xl:w-2/3 px-3">
                      <select
                        value={mappings[field] || ''}
                        onChange={(e) => handleMappingChange(field, e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="">Seleccione campo...</option>
                        {getAvailableFields(field).map((campo) => (
                          <option key={campo} value={campo}>{campo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Tipo cantidad
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    <select
                      id='tipoCantidad'
                      name='tipoCantidad'
                      value={tipoCantidad}
                      onChange={e => setTipoCantidad(e.target.value)}
                      className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Elige...</option>
                      <option value="campo">Campo</option>
                      <option value="valor">Valor</option>
                    </select>
                  </div>
                </div>
                {tipoCantidad === 'campo' && (
                  <div className="flex items-center">
                    <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Cantidad
                      </label>
                    </div>
                    <div className="w-full xl:w-2/3 px-3">
                      <select
                        id='cantidadCampo'
                        name='cantidadCampo'
                        value={cantidadCampo}
                        onChange={e => setCantidadCampo(e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="">--Seleccione el campo--</option>
                        {Object.keys(record.own).filter(key => record.own[key].tipo === 'number').map((campo) => (
                          <option key={campo} value={campo}>{campo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {tipoCantidad === 'valor' && (
                  <div className="flex items-center">
                    <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Cantidad
                      </label>
                    </div>
                    <div className="w-full xl:w-2/3 px-3">
                      <input
                        type="text"
                        id='cantidadNumero'
                        name='cantidadNumero'
                        value={cantidadNumero}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d+$/.test(inputValue) || inputValue === '') {
                            setCantidadNumero(inputValue);
                          }
                        }}
                        className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
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
  )
}

export default InputAcciones



/*'use client'
import React, { useState, useEffect } from 'react'
import { TrashIcon } from 'lucide-react'

const InputAcciones = ({ record, setRecord, action: initialAction, recordList }) => {
  const [referenciaID] = useState(initialAction.writeOnRecord || '');
  const [referenciaCampos, setReferenciaCampos] = useState([]);
  const [mappings, setMappings] = useState(initialAction.mappings || {});
  const [action, setAction] = useState({ ...initialAction });
  const [selectedFields, setSelectedFields] = useState(initialAction.selectedFields || [...record.identifier]);

  const defaultValue = recordList.find(record => record._id === action.writeOnRecord)?.name || '';
  const [selectedValue, setSelectedValue] = useState('');

  const [tipoCantidad, setTipoCantidad] = useState(initialAction.quantityType || '');
  const [cantidadCampo, setCantidadCampo] = useState(initialAction.quantityField || '');
  const [cantidadNumero, setCantidadNumero] = useState(initialAction.quantityNumber || '');

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setMappings(initialAction.mappings || {});
  }, [initialAction]);

  useEffect(() => {
    setReferenciaCampos([]);
    if (recordList.length > 0 && initialAction.writeOnRecord !== '') {
      const recordSelected = recordList.find(record => record._id === referenciaID);
      if (recordSelected) {
        const campos = Object.keys(recordSelected.own).filter(key => {
          const field = recordSelected.own[key];
          return field.tipo !== 'formula' && field.tipo !== 'referencia';
        });
        setReferenciaCampos(campos);
      }
    }
  }, [initialAction, recordList, referenciaID]);

  useEffect(() => {
    const updatedAction = {
      ...action,
      mappings: mappings,
      selectedFields: selectedFields,
      quantityType: tipoCantidad,
      quantityField: cantidadCampo,
      quantityNumber: cantidadNumero
    };

    setAction(updatedAction);

    const updatedActions = record.actions.map(act =>
      act.actionKey === action.actionKey ? updatedAction : act
    );

    setRecord({
      ...record,
      actions: updatedActions
    });
  }, [mappings, selectedFields, tipoCantidad, cantidadCampo, cantidadNumero]);

  const onDeleteAction = (event) => {
    event.preventDefault();
    const updatedActions = record.actions.filter(action => {
      return action.actionKey !== initialAction.actionKey;
    });

    setRecord({ ...record, actions: updatedActions });
  };

  const handleMappingChange = (identifier, value) => {
    setMappings(prevMappings => ({
      ...prevMappings,
      [identifier]: value
    }));
  };

  const handleFieldSelection = (field) => {
    setSelectedFields(prevFields => {
      if (prevFields.includes(field)) {
        return prevFields.filter(f => f !== field);
      } else {
        return [...prevFields, field];
      }
    });
    // Limpiar el mapeo si se deselecciona un campo
    if (mappings[field]) {
      handleMappingChange(field, '');
    }
  };

  // Función para obtener los campos disponibles para mapeo
  const getAvailableFields = (currentField) => {
    return referenciaCampos.filter(campo => 
      !Object.values(mappings).includes(campo) || mappings[currentField] === campo
    );
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2"></div>
      <div className="flex justify-end items-start">
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="col-span-3">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full xl:w-1/2 px-3 mb-6 xl:mb-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-3 mb-3">
                <h5 className="text-lg font-medium">Genera la acción</h5>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Registro
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    <input
                      type="text"
                      defaultValue={record.name}
                      readOnly
                      className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Campos a copiar
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    {Object.keys(record.own).map((field) => (
                      <div key={field} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`field-${field}`}
                          checked={selectedFields.includes(field)}
                          onChange={() => handleFieldSelection(field)}
                          className="mr-2"
                        />
                        <label htmlFor={`field-${field}`} className="text-sm">
                          {field}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 px-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="border-b pb-3 mb-3">
                <h5 className="text-lg font-medium">Recibe la acción</h5>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Registro
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    <input
                      type="text"
                      defaultValue={selectedValue}
                      readOnly
                      className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                {selectedFields.map((field) => (
                  <div className="flex items-center" key={field}>
                    <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        {field}
                      </label>
                    </div>
                    <div className="w-full xl:w-2/3 px-3">
                      <select
                        value={mappings[field] || ''}
                        onChange={(e) => handleMappingChange(field, e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="">Seleccione campo...</option>
                        {getAvailableFields(field).map((campo) => (
                          <option key={campo} value={campo}>{campo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <div className="flex items-center">
                  <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Tipo cantidad
                    </label>
                  </div>
                  <div className="w-full xl:w-2/3 px-3">
                    <select
                      id='tipoCantidad'
                      name='tipoCantidad'
                      value={tipoCantidad}
                      onChange={e => setTipoCantidad(e.target.value)}
                      className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Elige...</option>
                      <option value="campo">Campo</option>
                      <option value="valor">Valor</option>
                    </select>
                  </div>
                </div>
                {tipoCantidad === 'campo' && (
                  <div className="flex items-center">
                    <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Cantidad
                      </label>
                    </div>
                    <div className="w-full xl:w-2/3 px-3">
                      <select
                        id='cantidadCampo'
                        name='cantidadCampo'
                        value={cantidadCampo}
                        onChange={e => setCantidadCampo(e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="">--Seleccione el campo--</option>
                        {Object.keys(record.own).filter(key => record.own[key].tipo === 'number').map((campo) => (
                          <option key={campo} value={campo}>{campo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {tipoCantidad === 'valor' && (
                  <div className="flex items-center">
                    <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Cantidad
                      </label>
                    </div>
                    <div className="w-full xl:w-2/3 px-3">
                      <input
                        type="text"
                        id='cantidadNumero'
                        name='cantidadNumero'
                        value={cantidadNumero}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d+$/.test(inputValue) || inputValue === '') {
                            setCantidadNumero(inputValue);
                          }
                        }}
                        className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
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
  )
}

export default InputAcciones*/
