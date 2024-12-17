'use client';

import { getAllowedUsersAction, getEntriesByRecordAction, getRolesAction } from "@/app/_actions";
import { useSession } from "next-auth/react";
import React, { Fragment, useState, useEffect } from 'react';

const ModalSelecEntrie = ({ show, onHide, setselectedfield, type, campo }) => {

  const { data: session } = useSession();

  const [referenciaData, setReferenciaData] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");

  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleSelectButtonClick = () => {
    let selectedValue;
    
    if (type === 'referencia') {
      const column = campo.campo;
      selectedValue = selectedRow !== null ? referenciaData[selectedRow]?.values[column] : "";
    }
    if (type === 'user') {
      selectedValue = selectedRow !== null ? referenciaData[selectedRow].email : "";
    }
    if (type === 'role') {
      selectedValue = selectedRow !== null ? referenciaData[selectedRow].name : "";
    }
    if (type === 'entradaRelacionada') {
      selectedValue = selectedRow !== null ? referenciaData[selectedRow].values : '';
    }
    handleselected(selectedValue);
    onHide();
  };

  useEffect(() => {
    if (type !== '') {
      const fetchReferenciaData = async () => {
        if (type === 'referencia' || type === 'entradaRelacionada') {
          const entries = await getEntriesByRecordAction(campo?.record);
          setReferenciaData(entries);
        }
        if (type === 'user') {
          const allowedUsers = await getAllowedUsersAction(session?.user?.organization);
          setReferenciaData(allowedUsers);
        }
        if (type === 'role') {
          const response = await getRolesAction(session?.user?.organization);
          setReferenciaData(response.roles);
        }
      };
      fetchReferenciaData();
    }
  }, [type, campo.record]);

  const handleselected = (value) => {
    setselectedfield(value);
    setSelectedRow('')
  };

  const handleClose = ()=>{
    setSelectedRow('')
    onHide()
  }

  return (
    <div className={`fixed inset-0 z-50 ${show ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-1/2 h-1/2">
          <div className="bg-white p-4 sm:p-6 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Seleccione entrada
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onHide}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex-1 overflow-auto">
              <div className="border rounded shadow-none">
                <div className="border-b p-4">
                  {(type === 'referencia' || type === 'entradaRelacionada') && referenciaData.length > 0 && (
                    <Fragment>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th></th>
                            {Object.keys(referenciaData[0].values).map((key) => (
                              <th key={key} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {referenciaData.map((item, index) => (
                            <tr
                              key={index}
                              onClick={() => handleRowClick(index)}
                              className={`${selectedRow === index ? 'bg-blue-100' : ''} cursor-pointer`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRow === index}
                                  onChange={() => handleRowClick(index)}
                                />
                              </td>
                              {Object.values(item.values).map((value, valueIndex) => (
                                <td key={valueIndex} className="px-6 py-4 whitespace-nowrap">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Fragment>
                  )}
                  {type === 'user' && referenciaData.length > 0 && (
                    <Fragment>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th></th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {referenciaData.map((user, index) => (
                            <tr
                              key={index}
                              onClick={() => handleRowClick(index)}
                              className={`${selectedRow === index ? 'bg-blue-100' : ''} cursor-pointer`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRow === index}
                                  onChange={() => handleRowClick(index)}
                                />
                              </td>
                              <td key={user._id} className="px-6 py-4 whitespace-nowrap">
                                {user.email}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Fragment>
                  )}
                  {type === 'role' && referenciaData.length > 0 && (
                    <Fragment>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th></th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {referenciaData.map((rol, index) => (
                            <tr
                              key={index}
                              onClick={() => handleRowClick(index)}
                              className={`${selectedRow === index ? 'bg-blue-100' : ''} cursor-pointer`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedRow === index}
                                  onChange={() => handleRowClick(index)}
                                />
                              </td>
                              <td key={rol._id} className="px-6 py-4 whitespace-nowrap">
                                {rol.name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 mb-3 mr-5 flex items-center justify-end gap-x-6">
                  <button 
                        type="button" 
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleClose}
                  > Cancelar</button>
                  <button
                        type="button"
                        onClick={handleSelectButtonClick}
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >Seleccionar</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSelecEntrie;
