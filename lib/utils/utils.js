import {  clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}



export function replaceVariables(expression, values) {
  return expression.replace(/\b[A-Za-z][A-Za-z0-9]*\b/g, (match) => {
      if (values.hasOwnProperty(match)) {
          return values[match];
      }
      return match;
  });
}

export function evaluateExpression(expression) {
  try {
      return evaluate(expression);
  } catch (error) {
      console.error('Error evaluating expression:', error);
      return null;
  }
}

export function convertirFormula(formula) {
 
  // Paso 1: Reemplazar fracciones por divisiones
  formula = formula.replace(/\\frac{(.*?)}{(.*?)}/g, '($1)/($2)');

  // Paso 2: Reemplazar raíces cuadradas por sqrt()
  formula = formula.replace(/\\sqrt{(.*?)}/g, 'sqrt($1)');
 
  // Paso 3: Convertir operador de multiplicación explícito a *
  formula = formula.replace(/\\cdot/g, '*');
  
  // Paso 4: Reemplazar comas decimales por puntos decimales
  formula = formula.replace(/(\d+),(\d+)/g, '$1.$2');
  
   // Paso 5: Eliminar comandos \left y \right
  formula = formula.replace(/\\left/g, '');
  formula = formula.replace(/\\right/g, '');
  
     // Paso 6: Reemplazar A^B por pow(A,B)
  formula = formula.replace(/([A-Za-z0-9]+)\^([A-Za-z0-9]+)/g, 'pow($1,$2)');
  
  const summations = processSummations(formula);
  for (const sum of summations) {
      formula = formula.replace(sum.original, `(${sum.expression})`);
  }   
  
  return formula;
}

export function processSummations(formula) {
  // Array para almacenar los resultados de las sumatorias procesadas
  const processedSummations = [];
 /*const sumMatchesRegex = /\\sum_{_{\\{i=([^}]+)\}}}(\^{(.*?)})?/g;*/
 const sumMatchesRegex = /\\sum_{_{\\{i=([^}]+)\}}}(\^{(.*?)})?([^\\]*)/g;
  // Coincidir con todas las sumatorias en la fórmula
  let match;
  while ((match = sumMatchesRegex.exec(formula)) !== null) {
      console.log("Match:", match);
      // Extraer el rango inferior y superior de la sumatoria
      const variablePrefix = match[1].replace(/[0-9\\]/g, ''); // Extraer el prefijo (letra)
      
      const lowerBound = parseInt(match[1].replace(/[A-Za-z]/g, '')); // Rango inferior
      const upperBound = parseInt(match[3].replace(/[A-Za-z]/g, '') || lowerBound); // Rango superior (si está presente)
      const operation = match[4].trim(); // Operación que sigue a la sumatoria
      console.log(operation)
      // Construir la expresión de la sumatoria
      /*const sumExpression = Array.from({ length: upperBound - lowerBound + 1 }, (_, i) => `${variablePrefix}${lowerBound + i}`).join('+');*/
              // Construir la expresión de la sumatoria con la operación
      const sumExpression = Array.from({ length: upperBound - lowerBound + 1 }, (_, i) => 
          operation.replace('i', `${variablePrefix}${lowerBound + i}`)
      ).join('+');
              // Almacenar la expresión de la sumatoria procesada
      processedSummations.push({ original: match[0], expression: sumExpression });
  }     

  return processedSummations;
}

export function convertFileToBase64(file){
  return new Promise( (resolve,reject) =>{
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
              resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
              reject(error)
            }
  } )
}

export function convertPDFToBase64(file) {
return new Promise((resolve, reject) => {
  const reader = new FileReader();
  // Configurar el evento onload para la lectura del archivo
  reader.onload = () => {
    const base64String = reader.result.split(',')[1]; // Obtener la parte de datos Base64
    resolve(base64String);
  };
  // Configurar el evento onerror en caso de que haya un problema con la lectura del archivo
  reader.onerror = (error) => {
    reject(error);
  };
  // Leer el contenido del archivo como una URL de datos
  reader.readAsDataURL(file);
});
}

export const DaysDifCurrentDate=(stringDate)=>{
  const currentDate = new Date();
  const entryDueDate = new Date(stringDate);
  const timeDiff = entryDueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}


/**
 * Convierte un documento o array de documentos a objetos planos de JavaScript.
 * @param {*} doc - El documento o array de documentos a convertir.
 * @returns {*} El documento o array de documentos convertido a objetos planos.
 */
export function convertToPlainObject(doc) {
  if (Array.isArray(doc)) {
    return doc.map(convertToPlainObject);
  }
  if (doc !== null && typeof doc === 'object') {
    const plainObject = {};
    for (const key in doc) {
      if (Object.prototype.hasOwnProperty.call(doc, key)) {
        if (key === '_id' && doc._id && typeof doc._id.toString === 'function') {
          plainObject[key] = doc._id.toString();
        } else {
          plainObject[key] = convertToPlainObject(doc[key]);
        }
      }
    }
    return plainObject;
  }
  return doc;
}