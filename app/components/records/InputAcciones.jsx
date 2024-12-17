'use client'
import {useState,useEffect,Fragment} from 'react'
import { TrashIcon } from '@heroicons/react/24/outline';

const InputAcciones = ({record,setRecord,action : initialAction,recordList}) => {

    
    const [referenciaID,setReferenciaID] = useState(initialAction.writeOnRecord ||'');
    const [referenciaCampos,setReferenciaCampos] = useState([]);
    const [referenciaCampoSeleccionado,setReferenciaCampoSeleccionado]= useState(initialAction.writeOnField || '')
    const [campoOrigen,setCampoOrigen] = useState(initialAction.recordField ||'')
    const [tipoCantidad, setTipoCantidad] = useState(initialAction.quantityType ||'')
    const [cantidadCampo,setCantidadCampo] = useState(initialAction.quantityField ||'')
    const [cantidadNumero,setCantidadNumero] = useState(initialAction.quantityNumber || '')
    const [action,setAction] = useState({...initialAction})

    const defaultValue = recordList.find(record => record._id === action.writeOnRecord)?.name || '';
    const [selectedValue, setSelectedValue] = useState('');

    const ownFields = Object.keys(record.own)
    const ownFieldsNumber = [];
    // Itera a través de las claves de 'own'
    for (const key of ownFields) {
    const field = record.own[key];
        // Verifica si el campo es de tipo 'number'
        if (field && field.tipo === 'number') {
            ownFieldsNumber.push(key);
        }
    }

    useEffect(() => {
      setSelectedValue(defaultValue);
    }, [defaultValue]);

    useEffect(()=>{
        setReferenciaCampos([])
        if(recordList.length>0 && initialAction.writeOnRecord!==''){
            const recordSelected =  recordList.find(record => record._id ===referenciaID)
            if (recordSelected) {
                const campos = Object.keys(recordSelected.own).filter(key => {
                    const field = recordSelected.own[key];
                    return field.tipo !== 'formula' && field.tipo !== 'referencia';
                  });
              setReferenciaCampos(campos);
            }
        }
    },[initialAction, recordList, initialAction.writeOnRecord])

    useEffect(() => {
        // Actualizar el estado de `action` aquí
        const updatedAction = {
            ...action,
            recordField:campoOrigen,
            writeOnField:referenciaCampoSeleccionado,
            quantityType:tipoCantidad,
            quantityField:cantidadCampo,
            quantityNumber:cantidadNumero
        };

        setAction(updatedAction);

        // Actualizar el estado de `record.actions` aquí
        const updatedActions = record.actions.map(act => 
            act.actionKey === action.actionKey ? updatedAction : act
        );

        setRecord({
            ...record,
            actions: updatedActions
        });
    }, [campoOrigen, referenciaCampoSeleccionado, tipoCantidad, cantidadCampo, cantidadNumero]);

    const onDeleteAction = (event) => {
        event.preventDefault()
        const updatedActions = record.actions.filter(action => {
            return action.actionKey !== initialAction.actionKey;
        });
    
        setRecord({ ...record, actions: updatedActions });
    };

  return (
    
    <div className="grid grid-cols-3">
    {/* Espacio vacío */}
    <div className="col-span-2"></div>
    {/* Botón con TrashIcon */}
    <div className="flex justify-end items-start">
        <button className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none" onClick={onDeleteAction}>
            <TrashIcon className="h-6 w-6" />
        </button>
    </div>
    {/* Contenido */}
    <div className="col-span-3">
         <div className="flex flex-wrap -mx-3 mb-6">
        {/* Record which generates the action */}
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
                                Campo
                            </label>
                        </div>
                        <div className="w-full xl:w-2/3 px-3">
                            <select
                                id='campoOrigen'
                                name='campoOrigen'
                                value={campoOrigen}
                                onChange={e => setCampoOrigen(e.target.value)}
                                className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option value="">Elige...</option>
                                {Object.keys(record.own).map((campo) => (
                                    <option key={campo} value={campo}>{campo}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Record which receives the action */}
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
                    <div className="flex items-center">
                        <div className="w-full xl:w-1/3 px-3 mb-3 xl:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Campo
                            </label>
                        </div>
                        <div className="w-full xl:w-2/3 px-3">
                            <select
                                id='referenciaCampo'
                                name='referenciaCampo'
                                value={referenciaCampoSeleccionado}
                                onChange={e => setReferenciaCampoSeleccionado(e.target.value)}
                                className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option value="">Elige...</option>
                                {referenciaCampos.map((campo) => (
                                    <option key={campo} value={campo}>{campo}</option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                                    {ownFieldsNumber.map((campo) => (
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