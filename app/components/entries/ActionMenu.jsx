'use client'
import { Fragment,useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import OffCanvasEditEntrie from './OffCanvasEditEntrie'
import ConfirmationModal from '../ui/ConfirmationModal'
import OffCanvasArchiveEntrie from './OffCanvasArchiveEntrie'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ActionMenu({isActive,completed,entrie}) {

    const [showModal,setShowModal]=useState(false)
    const [showModalObsolete,setShowModalObsolete]=useState(false)

    const handleModal=()=>{
        setShowModal(!showModal)
    }

    const handleModalObsolete=()=>{
        setShowModalObsolete(!showModalObsolete)
    }


  return (
    <Fragment>
            <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                    <Menu.Item>
                    {({ active }) => (
                        <button
                        onClick={handleModal}
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                        )}
                        >
                        {!completed && isActive && 'Completar'}
                        {(!isActive || completed) && 'Ver'}
                        </button>
                    )}
                    </Menu.Item>
                </div>
                <div className="py-1">
                    <Menu.Item>
                    {({ active }) => (
                        <button
                        onClick={handleModalObsolete}
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                        )}
                        >
                        Archivar
                        </button>
                    )}
                    </Menu.Item>
                </div>
                </Menu.Items>
            </Transition>
            </Menu>  
            <OffCanvasEditEntrie open={showModal} setOpen={setShowModal} initialentrie={entrie}/>
            <OffCanvasArchiveEntrie open={showModalObsolete} setOpen={setShowModalObsolete} initialentrie={entrie}/>          
    </Fragment>
  )
}
