'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { addCollaboratorsAction, getAllowedUsersAction } from '@/app/_actions'

const RecordAddCollaboratorModal = ({ show, onHide, record, ...modalProps }) => {
  const router = useRouter()
  const [collaborators, setCollaborators] = useState([])
  const [option, setOption] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { userList } = await getAllowedUsersAction()
      const userSet = new Set(userList.map(user => JSON.stringify({
        value: user._id,
        label: user.email
      })))

      const uniqueUsers = Array.from(userSet).map(user => JSON.parse(user))

      setOption(uniqueUsers)
    }
    fetchUsers()
  }, [])

  function handleSelect(data) {
    setCollaborators(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const collaboratorsValue = collaborators.map(collaborator => collaborator.value)

    try {

      const createdByPresent = collaboratorsValue.includes(record.createdBy._id)   
      const collaboratorsPresent = record?.collaborators.some(collaborator => collaboratorsValue.includes(collaborator._id))

      if (createdByPresent || collaboratorsPresent) {
        console.log('q onda')
        setMsg('El/Los colaboradores que quiere agregar ya se encuentran en el registro.')
        setTimeout(() => {
          setMsg('')
        }, 2500)

        return
      }

      const response = await addCollaboratorsAction(record._id, collaboratorsValue)

    } catch (error) {
      toast(`${error.message}`, {
        theme: 'dark',
        type: 'error',
        autoClose: 2000
      })
      setCollaborators([])
    }
    onHide()
  }

  const handleModal = () => {
    setCollaborators([])
    setOption([])
    onHide()
  }

  if (!show) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex"
      aria-labelledby="contained-modal-title-vcenter"
      onClick={onHide}
    >
      <div
        className="relative p-8 bg-gray-300 w-full max-w-2xl m-auto flex-col flex rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold" id="contained-modal-title-vcenter">
            Agregar colaboradores
          </p>
          <div className="cursor-pointer z-50" onClick={onHide}>
            <svg
              className="fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path d="M14.53 4.53a.75.75 0 0 0-1.06-1.06L9 7.94 4.53 3.47a.75.75 0 0 0-1.06 1.06L7.94 9l-4.47 4.47a.75.75 0 1 0 1.06 1.06L9 10.06l4.47 4.47a.75.75 0 0 0 1.06-1.06L10.06 9l4.47-4.47z" />
            </svg>
          </div>
        </div>
        {msg && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{msg}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Select
              options={option}
              isMulti
              value={collaborators}
              onChange={handleSelect}
              placeholder="Seleccione colaboradores"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
                <button 
                        type="button" 
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleModal}
                >Cancelar</button>
                <button
                    type='submit'
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >Agregar</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default RecordAddCollaboratorModal
