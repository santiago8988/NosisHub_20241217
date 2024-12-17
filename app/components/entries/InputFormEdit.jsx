"use client";
import React, { Fragment } from 'react';

const InputFormEdit = ({
  campo,
  label,
  type,
  selectedNumber,
  setSelectedNumber,
  formulaResult,
  compareStatus,
  selectedField,
  setselectedfield,
  setModalShowEntrie,
  handleChange,
  identifier
}) => {

    console.log(compareStatus)
  return (
      
    <Fragment>
      {!['referencia', 'user', 'role'].includes(type) ? (
        <Fragment>
          {type === 'number' ? (
            <div className="mb-4">
              <label htmlFor={`${label}`} className="text-gray-700 uppercase font-bold text-sm">
                {label}
              </label>
              <input
                type="text"
                id={`${label}`}
                name={`${label}`}
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                value={selectedNumber !== null ? selectedNumber : ''}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Validamos si es un número válido antes de actualizar el estado
                  if (/^[-+]?\d*\.?\d*$/.test(inputValue)) {
                    // Evitar más de un punto o coma como separador decimal
                    const normalizedValue = inputValue.replace(/([.,])[.,]+/g, '$1');
                    setSelectedNumber(normalizedValue);
                    handleChange(e);
                  }
                }}
                readOnly={identifier.includes(label)}
              />
            </div>
          ) : type === 'formula' ? (
            <div className="mb-4">
              <label htmlFor={`${label}`} className="text-gray-700 uppercase font-bold text-sm">
                {label}
              </label>
              <input
                type="text"
                id={`${label}`}
                name={`${label}`}
                placeholder={`${campo.formula}`}
                value={formulaResult}
                readOnly
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
              />
            </div>
          ) : type === 'comparacion' ? (
            <div className="mb-4">
              <label htmlFor={`${label}`} className="text-gray-700 uppercase font-bold text-sm">
                {label}: {campo.operation !== 'entre' ? `${campo.field}${campo.operation}${campo.value1}` : `${campo.field}${campo.operation}${campo.value1}-${campo.value2}`}
              </label>
              <input
                type="text"
                id={`${label}`}
                name={`${label}`}
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                value={compareStatus}
                readOnly
              />
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor={`${label}`} className="text-gray-700 uppercase font-bold text-sm">
                {label}
              </label>
              <input
                type={`${type}`}
                id={`${label}`}
                name={`${label}`}
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                value={selectedField}
                onChange={(e) => setselectedfield(e.target.value)}
                readOnly={identifier.includes(label)}
              />
            </div>
          )}
        </Fragment>
      ) : (
        <Fragment>
          <div className="mb-4">
            <div className="flex items-center">
              <label htmlFor={`${label}`} className="text-gray-700 uppercase font-bold text-sm mx-2">
                {label}
              </label>
              {!identifier.includes(label) && (
                <button
                  onClick={() => setModalShowEntrie(true)}
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Seleccionar
                </button>
              )}
            </div>
            <input
              type={`${type}`}
              id={`${label}`}
              name={`${label}`}
              className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
              defaultValue={selectedField}
              readOnly
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default InputFormEdit;
