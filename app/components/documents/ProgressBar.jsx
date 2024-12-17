'use client'

import React,{Fragment} from 'react';

function ProgressBar({ currentStep }) {
  const steps = ['Borrador', 'Creado', 'Revisado','Aprobado','Publicado'];
  const stepsModel = ['draft', 'created', 'reviewed', 'approved','published','obsolete']
  const indexCurrentStep = stepsModel.indexOf(currentStep)+1;
 
  return (
    <Fragment>
      {currentStep !=='obsolete' ? (
                    <div className="relative w-full">
                      <div className="flex justify-between w-full mt-2">
                        {steps.map((step, index) => (
                          <div
                            key={step}
                            className={`
                              w-1/3 text-center py-2 px-4 relative 
                              ${index === indexCurrentStep - 1 ? 'border-b-2 border-blue-500' : 'border-b border-gray-200'}
                            `}
                          >
                            <span className="flex items-center">
                              <span
                                className={`
                                  w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-white
                                  ${index < indexCurrentStep - 1 ? 'border-2 border-blue-500 text-blue-500 after:content-["✓"] after:absolute' : 'border border-gray-200'}
                                `}
                              >
                                {index < indexCurrentStep - 1 ? '' : index + 1}
                              </span>
                              <span className={`${index === indexCurrentStep - 1 ? 'text-blue-500' : index < indexCurrentStep ? 'text-black' : 'text-gray-500'}`}>
                                {step}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

      ):(
                  <div className="relative w-full">
                    <div className="grid place-items-center w-full mt-2"> 
                      <div
                        key={currentStep}
                        className={`py-2 px-4 relative border-b-2 
                                    ${currentStep === 'obsolete' ? 'border-gray-300' : 'border-blue-500'} 
                                    text-gray-500`}
                      >
                        <span className="flex items-center">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-white 
                                        border-2 ${currentStep === 'obsolete' ? 'border-gray-300' : 'border-blue-500'}
                                        ${currentStep === 'obsolete' ? 'text-gray-300' : 'text-blue-500'}`}
                          >
                            {1}
                          </span>
                          <span>Archivado</span>
                        </span>
                      </div>
                    </div>
                  </div>

      )}

    </Fragment>
  );
}

export default ProgressBar;


