'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { createNextEntrie, changeNextField, executeAction, createEntryAction } from '@/app/_actions';
import InputForm from '@/app/components/entries/InputForm';
import { toast } from 'react-toastify';
import { convertFileToBase64 } from '@/lib/utils/utils';

const EntrieAddModal = ({ show, initialRecord, onHide }) => {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [record, setRecord] = useState(initialRecord ? initialRecord : {});
  const [alerta, setAlerta] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formulasToCalculate, setFormulasToCalculate] = useState([]);
  const [updatedFormObject, setUpdatedFormObject] = useState({});
  const formRef = useRef(null);
  const [formValues, setFormValues] = useState({});
  const [file, setFile] = useState('');

 

  useEffect(() => {
    if (record) {
      const { own } = record;
      own && typeof own === 'object' && Object.keys(own).map((campo) => {
        if (own[campo].tipo === 'formula') {
          setFormulasToCalculate((prevFormulas) => ({
            ...prevFormulas,
            [campo]: own[campo],
          }));
        }
      });
    }

    if (record && record.own && typeof record.own === 'object') {
      const updatedInitialState = {};

      for (const campo in record.own) {
        if (record.own.hasOwnProperty(campo)) {
          updatedInitialState[campo] = '';
        }
      }
      setFormValues(updatedInitialState);
    }
  }, [record]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const validateFormObject = (formObject) => {
    for (const key in formObject) {
      if (formObject.hasOwnProperty(key)) {
        const value = formObject[key];
        if (typeof value !== 'object' && !(value instanceof File)) {
          if (value.trim() === '') {
            return false; // Encontramos un campo vacío, la validación falla
          }
        }
      }
    }
    return true; // Todos los campos están llenos, la validación es exitosa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file && file.type !== 'application/pdf') {
      setAlerta({
        msg: 'El archivo debe ser PDF',
        error: true,
      });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
      return;
    }

    const form = formRef.current;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const isValid = validateFormObject(formObject);

    if (isValid) {
      const newValues = { ...record.own };
      Object.keys(newValues).map(field => {
        if (newValues[field].tipo === 'entradaRelacionada') {
          let newObject = {};
          newValues[field].fieldsToWrite.map((fieldInside, index) => {
            newObject[fieldInside.label] = formObject[`${field}_${fieldInside.label}`];
          });
          newValues[field] = newObject;
        } else {
          newValues[field] = formObject[field];
        }
      });

      let base64 = null;
      if (file) {
        const formData = new FormData();
        formData.set('file', file);
        base64 = await convertFileToBase64(formData.get('file'));
      }
      setIsLoading(true);
      const entrie = {
        record: id,
        dueDate: formObject.FECHA,
        createdBy: session?.user?.email,
        values: newValues,
        completed: true,
        pdf: base64,
        completedBy: session?.user?.email,
      };

      console.log(entrie)
      const response = await createEntryAction(entrie, record);

      if (response && response._id) {
        toast('Entrada creada.', {
          theme: 'dark',
          type: 'success',
          autoClose: 1500,
        });
        if (actions.length > 0) {
          const responseAction = await executeAction(actions, formObject);
          if (responseAction.every(action => action.success && action.error === "")) {
            toast('Actions executed successfully.', {
              theme: 'colored',
              type: 'success',
              autoClose: 1500,
            });
          } else {
            toast('The creation of some action has failed', {
              theme: 'colored',
              type: 'error',
              autoClose: 1500,
            });
          }
        }

        if (type !== 'NOT PERIODIC' && !response.nextCreated) {
          const newEntrie = await createNextEntrie(entrie, identifier, periodicity, type);
          if (newEntrie && newEntrie._id) {
            toast('Your next entrie has been created successfully.', {
              theme: 'dark',
              type: 'success',
              autoClose: 1500,
            });
            const { state } = await changeNextField(response._id);
            if (state === 200) {
              toast('Your entrie has been updated successfully.', {
                theme: 'dark',
                type: 'success',
                autoClose: 1500,
              });
            }
          }
        }
        setTimeout(() => {
          setIsLoading(false);
          handleClose();
        }, 2500);
      } else {
        toast(`${response?.msg}`, {
          theme: 'colored',
          type: 'error',
          autoClose: 1500,
        });
        setIsLoading(false);
        return;
      }
    } else {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true,
      });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    }
  };

  const handleInputChange = (label, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [label]: value,
    }));
  };

  const handleClose=()=>{
    if (formRef.current) {
      formRef.current.reset(); // Reinicia el formulario
    }
    setFormValues({});
    setUpdatedFormObject({});
    setFile('');
    setFormulasToCalculate([]);
    setAlerta({});
    onHide();
  }

  const { msg } = alerta;
  const { own, name, code, type, periodicity, identifier, actions } = record;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold">
            Crear Entrada
            {msg && (
              <div className="mt-2 text-red-500 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 100 24 12 12 0 000-24zm0 20a8 8 0 110-16 8 8 0 010 16zm1-7V7h-2v6h2zm0 2v-2h-2v2h2z"></path></svg>
                {msg}
              </div>
            )}
          </h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div className="p-5">
          <form ref={formRef} onSubmit={handleSubmit}>
            {msg && (
              <div className="mb-4 text-red-500 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 100 24 12 12 0 000-24zm0 20a8 8 0 110-16 8 8 0 010 16zm1-7V7h-2v6h2zm0 2v-2h-2v2h2z"></path></svg>
                {msg}
              </div>
            )}
            <div className="space-y-4">
              {own && typeof own === 'object' && Object.keys(own).map((campo) => {
                const fieldValue = updatedFormObject[campo] || '';
                return (
                  <div key={campo} className="mb-4">
                    <InputForm
                      campo={own[campo]}
                      label={campo}
                      type={own[campo].tipo}
                      action="creating"
                      values={fieldValue}
                      identifier={identifier}
                      formValues={formValues}
                      onInputChange={handleInputChange}
                    />
                  </div>
                );
              })}
              <div className="mb-4">
                <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
              </div>
            </div>
            <div className="mt-3 mb-3 mr-5 flex items-center justify-end gap-x-6">
                <button 
                    type="button" 
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={handleClose}
                >         
                Cancelar</button>
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creando...' : 'Crear'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EntrieAddModal;
