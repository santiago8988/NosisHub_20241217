// components/FormulaInput.jsx
'use client'
import React, { useState,Fragment, useEffect } from 'react';
import { evaluate } from 'mathjs';
import {addStyles} from 'react-mathquill'
import { convertirFormula } from '@/lib/utils/utils';
import dynamic from 'next/dynamic';

// Cargar dinámicamente EditableMathField sin SSR
const EditableMathField = dynamic(() => import('react-mathquill').then(mod => mod.EditableMathField), {
  ssr: false,
});

addStyles()

const InputFormula = ({ field, record,setRecord }) => {

  const [latex, setLatex] = useState(record?.own[field]?.formula ? record.own[field].formula : '');


  const handleFormulaChange = (mathField) => {
    const newLatex = mathField.latex();
    setLatex(newLatex);
    const ownToUpdate={...record.own}
    //CONVIERTO LA EXPRESION A MATHJS
    const expressionMathJS = convertirFormula(newLatex);
      // Asignar la fórmula Latex y la expresión transformada al objeto correspondiente
      const expressionUpperCase=expressionMathJS.toUpperCase()
      ownToUpdate[field] = {
        ...ownToUpdate[field],
        formula: newLatex,
        expresion: expressionUpperCase,
      };
    setRecord({...record,own:ownToUpdate})
  };



  return (
    <Fragment>
            <h1 className='text-base font-semibold leading-7 text-gray-900'>{`Ingrese la fórmula para el campo: ${field}`} </h1>
            <EditableMathField
                latex={latex}
                style={{ color: 'black', minWidth: '300px', minHeight: '50px' }} 
                onChange={handleFormulaChange}
            />
    </Fragment>
  );
};

export default InputFormula;
