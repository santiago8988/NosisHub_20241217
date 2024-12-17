'use client'

import { ToastContainer } from "react-toastify"
import { House,Calculator,Book } from "lucide-react"
import DocSidebar from "./components/doc-sidebar"
import DocSidebar2 from "./components/doc-sidebar2"


const sidebarItems = [
  {
    label: 'Introducción',
    id: 'introduccion',
    icon: <Book className="mr-2 h-5 w-5" />,
    items: [
      { title: 'Bienvenida', href: '/documentation#bienvenida', id: 'bienvenida' },
      { title: 'Cómo empezar', href: '/documentation#como-empezar', id: 'como-empezar' },
    ],
  },
  {
    label: 'Registros',
    id: 'registros',
    icon: <Book className="mr-2 h-5 w-5" />,
    items: [
      { title: 'Crear registro', href: '/documentation#crear-registro', id: 'crear-registro' },
      { title: 'Editar registro', href: '/documentation#editar-registro', id: 'editar-registro' },
      { title: 'Eliminar registro', href: '/documentation#eliminar-registro', id: 'eliminar-registro' },
    ],
  },
  {
    label: 'Entradas',
    id: 'entradas',
    icon: <Book className="mr-2 h-5 w-5" />,
    items: [
      { title: 'Tipos de entradas', href: '/documentation#tipos-entradas', id: 'tipos-entradas' },
      { title: 'Gestionar entradas', href: '/documentation#gestionar-entradas', id: 'gestionar-entradas' },
    ],
  },
  {
    label: 'Documentos',
    id: 'documentos',
    icon: <Book className="mr-2 h-5 w-5" />,
    items: [
      { title: 'Subir documentos', href: '/documentation#subir-documentos', id: 'subir-documentos' },
      { title: 'Organizar documentos', href: '/documentation#organizar-documentos', id: 'organizar-documentos' },
    ],
  },
]

const botitems=[
  {
      label:'Formulas Playground',
      href:'/formulas-playground',
      icon: <Calculator className="inline-block mr-2 h-5 w-5" />
  },
  {
      label:'Documentación',
      href:'/documentacion',
      icon: <Book className="inline-block mr-2 h-5 w-5" />
  },
]

const DocumentationLayout =  ({children}) => {

  return (
    <div className="flex min-h-screen">    
      {/*<DocSidebar items={sidebarItems} botItems={botitems}/>*/} 
      {<DocSidebar2 items={sidebarItems} botItems={botitems}/>}     
      <main className="flex-1 ml-64 overflow-x-hidden overflow-y-auto">
              {children}
      </main> 
      <ToastContainer/>
  </div>
  )
}

export default DocumentationLayout