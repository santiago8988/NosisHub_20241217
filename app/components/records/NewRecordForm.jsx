'use client'
import { useEffect, useState,useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { createRecordAction, getActiveRecordsAction } from '@/app/_actions'
import TabButton from '../TabButton'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import NewRecordForm1 from './NewRecordForm1'
import NavLink from '../ui/NavLink'
import NewRecordForm2 from './NewRecordForm2'
import NewRecordFormCompare from './NewRecordFormCompare'
import NewRecordFormFormula from './NewRecordFormFormula'
import NewRecordFormAction from './NewRecordFormAction'
import NewRecordValidation from './NewRecordValidation'


const NewRecordForm = ({initialRecord}) => {

    const { data: session, update } = useSession()

    const [activeTab, setActiveTab] = useState('inicial')
    const [isPending, startTransition] = useTransition()

      const defaultRecord = {
        name: '',
        type: '',
        periodicity: '',
        notify: '',
        description: '',
        own: {},
        identifier: [],
        actions: [],
      };

      
      const [record,setRecord]=useState(initialRecord || defaultRecord)
      /*-------------*/

      function selectTab(tab) {
        startTransition(() => {
          setActiveTab(tab)
        })
          
      }
      
  return  (
        <section className='mt-16'>
            <div className='grid w-full grid-cols-6 items-center justify-center gap-1.5 rounded-lg bg-gray-100 p-1.5 text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
              <TabButton
                value='inicial'
                activeTab={activeTab}
                isPending={isPending}
                onClick={() => selectTab('inicial')}
              >
                Configuracion Inicial
              </TabButton>
              <TabButton
                value='propio'
                activeTab={activeTab}
                onClick={() => selectTab('propio')}
              >
                Definir Campos
              </TabButton>
              <TabButton
                value='comparacion'
                activeTab={activeTab}
                onClick={() => selectTab('comparacion')}
              >
                Configurar Comparación
              </TabButton>
              <TabButton
                value='formula'
                activeTab={activeTab}
                onClick={() => selectTab('formula')}
              >
                Configurar Fórmulas
              </TabButton>
              <TabButton
                value='acciones'
                activeTab={activeTab}
                onClick={() => selectTab('acciones')}
              >
                Configurar Acciones
              </TabButton>
              <TabButton
                value='finalizar'
                activeTab={activeTab}
                onClick={() => selectTab('finalizar')}
              >
                Revisar y Crear
              </TabButton>
            </div>

            <div className='mt-3'>
              {activeTab === 'inicial' && <NewRecordForm1 record={record} setRecord={setRecord} selectTab={selectTab}/>}
              {activeTab === 'propio' && <NewRecordForm2 record={record} setRecord={setRecord} setActiveTab={setActiveTab}/>}
              {activeTab === 'comparacion' && <NewRecordFormCompare record={record} setRecord={setRecord} setActiveTab={setActiveTab}/>}
              {activeTab === 'formula' && <NewRecordFormFormula record={record} setRecord={setRecord} setActiveTab={setActiveTab} />}
              {activeTab === 'acciones' && <NewRecordFormAction record={record} setRecord={setRecord} setActiveTab={setActiveTab}/>}
              {activeTab === 'finalizar' && <NewRecordValidation record={record} />}
            </div>
        </section>

  )
}
export default NewRecordForm