"use client"

import { useState, useEffect, Fragment } from "react";
import ModalSelectEntrie from "@/components/entries/ModalSelecEntrie";
import InputFormCreating from "@/components/entries/InputFormCreating";
import InputFormEdit from "@/components/entries/InputFormEdit";

const InputForm = ({ campo, label, type, action, values, identifier, formValues, onInputChange }) => {
  
  const initialValue = type !== 'edit' ? values : '';
  const [modalShowEntrie, setModalShowEntrie] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(initialValue);
  const [compareStatus, setCompareStatus] = useState('');
  const [formulaResult, setFormulaResult] = useState('');

  useEffect(() => {
    if (['referencia', 'text', 'date', 'user', 'role', 'entradaRelacionada'].includes(type)) {
      setSelectedField(values);
    } else if (type === 'number' && values !== '') {
      setSelectedNumber(values);
    } else if (type === 'comparacion' && values !== '') {
      setCompareStatus(values);
    } else if (type === 'formula' && values !== '') {
      setFormulaResult(values);
    }
  }, [values]);

  useEffect(() => {
    let formValuesFormateado = {};

    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (typeof value === 'object') {
        Object.keys(value).forEach(subKey => {
          formValuesFormateado[`${key}.${subKey}`] = value[subKey];
        });
      } else {
        formValuesFormateado[key] = value;
      }
    });

    if (type === 'comparacion' && formValuesFormateado[campo.field] && formValuesFormateado[campo.field] !== '') {
      const fieldValue = parseFloat(formValuesFormateado[campo.field]);
      const value1 = parseFloat(campo.value1);
      let compareStatus = 'NO CUMPLE';

      if (campo.operationType === 'valor') {
        if (campo.operation !== 'entre') {
          if (campo.operation === '>' && fieldValue > value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '<' && fieldValue < value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '=' && fieldValue === value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '<=' && fieldValue <= value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '>=' && fieldValue >= value1) {
            compareStatus = 'CUMPLE';
          }
        } else {
          const value2 = parseFloat(campo.value2);
          if (fieldValue > value1 && fieldValue < value2) {
            compareStatus = 'CUMPLE';
          }
        }
      } else if (campo.operationType === 'campo') {
        const value1 = parseFloat(formValuesFormateado[campo.value1]);
        if (campo.operation !== 'entre') {
          if (campo.operation === '>' && fieldValue > value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '<' && fieldValue < value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '=' && fieldValue === value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '<=' && fieldValue <= value1) {
            compareStatus = 'CUMPLE';
          } else if (campo.operation === '>=' && fieldValue >= value1) {
            compareStatus = 'CUMPLE';
          }
        } else {
          const value2 = parseFloat(formValuesFormateado[campo.value2]);
          if (fieldValue > value1 && fieldValue < value2) {
            compareStatus = 'CUMPLE';
          }
        }
      }
      setCompareStatus(compareStatus);
    } else if (type === 'formula') {
      try {
        const fieldNames = Object.keys(formValuesFormateado);
        let formula = campo.formula;

        const escapedFieldNames = fieldNames.map(name => name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        let replacedFormula = formula;
        escapedFieldNames.forEach((fieldName, index) => {
          let placeholder = `%%%${index}%%%`;
          replacedFormula = replacedFormula.replace(new RegExp(fieldName, 'g'), placeholder);
        });

        let formulaSplitted = replacedFormula.split(/([-+*/])/).filter(part => part.trim() !== '');

        formulaSplitted = formulaSplitted.map(part => {
          escapedFieldNames.forEach((fieldName, index) => {
            let placeholder = `%%%${index}%%%`;
            part = part.replace(new RegExp(placeholder, 'g'), fieldNames[index]);
          });
          return part;
        });

        const formulaWithValues2 = formulaSplitted.map(part => {
          if (fieldNames.includes(part)) {
            const fieldValue = parseFloat(formValuesFormateado[part]);
            return isNaN(fieldValue) ? '' : fieldValue;
          } else {
            return part;
          }
        });

        const formulaString = formulaWithValues2.map(item => !isNaN(item) ? item : (['*', '+', '-', '/', '(', ')'].includes(item) ? item : `'${item}'`)).join('');

        const formulaResult = eval(formulaString);
        let roundedResult;

        if (formulaResult % 1 !== 0) {
          let decimalPartLength = formulaResult.toString().split('.')[1].length;
          if (decimalPartLength > 5) {
            roundedResult = formulaResult.toFixed(5);
          } else {
            roundedResult = formulaResult.toString();
          }
        } else {
          roundedResult = formulaResult.toString();
        }

        setFormulaResult(roundedResult);
      } catch (error) {
        setFormulaResult(campo.formula);
      }
    }
  }, [formValues]);

  useEffect(() => {
    if (type === 'comparacion' && compareStatus !== formValues[label]) {
      handleChangeDinamic(label, compareStatus);
    }
  }, [compareStatus]);

  useEffect(() => {
    if (!['comparacion', 'formula', 'number'].includes(type) && selectedField !== formValues[label]) {
      handleChangeDinamic(label, selectedField);
    }
  }, [selectedField]);

  useEffect(() => {
    if (type === 'number' && selectedNumber !== formValues[label]) {
      handleChangeDinamic(label, selectedNumber);
    }
  }, [selectedNumber]);

  useEffect(() => {
    if (type === 'formula' && formulaResult !== formValues[label]) {
      handleChangeDinamic(label, formulaResult);
    }
  }, [formulaResult]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onInputChange(label, newValue);
  };

  const handleChangeDinamic = (label, newValue) => {
    onInputChange(label, newValue);
  };

  return (
    <Fragment>
      {action === 'creating' && (
        <InputFormCreating
          campo={campo}
          label={label}
          type={type}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          formulaResult={formulaResult}
          compareStatus={compareStatus}
          selectedField={selectedField}
          setselectedfield={setSelectedField}
          setModalShowEntrie={setModalShowEntrie}
          handleChange={handleChange}
        />
      )}
      {action === 'edit' && (
        <InputFormEdit
          campo={campo}
          label={label}
          type={type}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          formulaResult={formulaResult}
          compareStatus={compareStatus}
          selectedField={selectedField}
          setselectedfield={setSelectedField}
          setModalShowEntrie={setModalShowEntrie}
          handleChange={handleChange}
          identifier={identifier}
        />
      )}
      
      {action === 'view' && (
        <Fragment>
          {!['referencia', 'user', 'role'].includes(type) ? (
            <Fragment>
              {type === 'number' ? (
                <div className="mb-4">
                  <label htmlFor={label} className="text-gray-700 uppercase font-bold text-sm">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={label}
                    name={label}
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    step={0.00001}
                    defaultValue={selectedNumber}
                    readOnly
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor={label} className="text-gray-700 uppercase font-bold text-sm">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={label}
                    name={label}
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    defaultValue={selectedField}
                    readOnly
                  />
                </div>
              )}
            </Fragment>
          ) : (
            <div className="mb-4">
              <label htmlFor={label} className="text-gray-700 uppercase font-bold text-sm">
                {label}
              </label>
              <input
                type={type}
                id={label}
                name={label}
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                defaultValue={selectedField}
                readOnly
              />
            </div>
          )}
        </Fragment>
      )}
      <ModalSelectEntrie show={modalShowEntrie} onHide={() => setModalShowEntrie(false)} type={type} campo={campo} setselectedfield={setSelectedField} />
    </Fragment>
  );
};

export default InputForm;
