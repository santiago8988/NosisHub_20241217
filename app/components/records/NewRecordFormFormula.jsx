'use client'
import { useEffect,useState,Fragment} from "react";
import InputFormula from "./InputFormula";



const NewRecordFormFormula = ({record,setRecord,setActiveTab}) => {

    
    const [formulaFields, setFormulaFields] = useState([]);
    const [numberFields, setNumberFields] = useState([]);
    const [referenceFields, setReferenceFields] = useState([]);
    const [formulas, setFormulas] = useState({});

    useEffect(() => {
        if(record && record.own && Object.keys(record?.own).length!==0){
                // Convertimos los valores del objeto record.own a un arreglo
                const campos = Object.values(record.own);
                
                // Verificamos si algún objeto tiene el atributo tipo igual a "formula"
                const tieneCampoFormula = campos.some((campo) => campo.tipo === "formula");
        
                if (tieneCampoFormula) {
                const formulaFields = Object.entries(record.own)
                .filter(([campo, info]) => info.tipo === "formula")
                .map(([campo]) => campo);
                setFormulaFields(formulaFields);
                
                const numberFields = Object.entries(record.own)
                .filter(([campo, info]) => info.tipo === "number")
                .map(([campo]) => campo);
                setNumberFields(numberFields);
        
                const referenciaFields = Object.entries(record.own)
                .filter(([campo, info]) => info.tipo === "referencia")
                .map(([campo]) => campo);
                setReferenceFields(referenciaFields)
        
                const entradaRelacionadaFields=Object.entries(record.own)
                .filter(([campo, info]) => info.tipo === "entradaRelacionada")
                .map(([campo]) => campo);
                if(entradaRelacionadaFields.length>0){
                    entradaRelacionadaFields.map(campo=>{
                        let insideFields=[...record.own[campo].fieldsToWrite];
                        insideFields.forEach(obj => {
                        switch (obj.value.tipo) {
                            case 'formula':
                                setFormulaFields(prevState => [...prevState, `${campo}.${obj.label}`]);
                                break;
                            case 'number':
                                setNumberFields(prevState => [...prevState, `${campo}.${obj.label}`]);
                                break;
                            case 'referencia':
                                setReferenceFields(prevState => [...prevState, `${campo}.${obj.label}`]);
                                break;
                            default:
                                // Manejo para cualquier otro tipo si es necesario
                                break;
                        }
                    });
        
                    })
                }
                }

        }

    }, [record]);



  return (
    <Fragment>
        {formulaFields.length!==0 ? (
            <Fragment>
                    {formulaFields.map(field=>{
                        return (
                            <Fragment key={field}>
                                <InputFormula field={field} record={record} setRecord={setRecord}/>
                            </Fragment>
                        )})
                    }
            </Fragment>        
        ) : (
            <p>No hay campos fórmula para configurar</p>
        )}
        <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={()=>setActiveTab('comparacion')}>
                    Anterior
                </button>
                <button
                    onClick={()=>setActiveTab('acciones')}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                   Siguiente
                 </button>
        </div>

    </Fragment>
  )
}

export default NewRecordFormFormula