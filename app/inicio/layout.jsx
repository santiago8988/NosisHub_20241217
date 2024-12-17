
import { ToastContainer } from "react-toastify"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getOrganizationAction } from "../_actions"

import { FileText,Folder,LockKeyhole,Home,Calculator,Book} from 'lucide-react'
import Sidebar2 from "../components/ui/SideBar2"


const itemsAdmin=[
    {
        label:'Admin',
        href:'/inicio/admin',
        icon: <LockKeyhole className="inline-block mr-2 h-5 w-5" />
    },
    {
        label:'Entradas',
        href:'/inicio',
        icon: <FileText className="inline-block mr-2 h-5 w-5" />
    },
    {
        label:'Documentos',
        href:'/inicio/documentos',
        icon: <Folder className="inline-block mr-2 h-5 w-5" />
    },

]

const itemsUser=[
    {
        label:'Entradas',
        href:'/inicio',
        icon: <FileText className="inline-block mr-2 h-5 w-5" />
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

/*className="flex flex-1 overflow-hidden">*/ 
const InicioLayout = async ({children}) => {
    const session = await getServerSession(authOptions)
    let organization = null

    if (session?.user?.organization) {
      organization = await getOrganizationAction(session.user.organization)
    }
 
  return (
        <div className="flex min-h-screen">
            {session?.user?.role==='admin' ? <Sidebar2 items={itemsAdmin} botItems={botitems} name={session?.user?.name} organization={organization?.data?.name}/> 
                                           :  <Sidebar2 items={itemsUser} botItems={botitems} name={session?.user?.name} organization={organization?.data?.name}/> }
            <main className="flex-1 ml-64 overflow-x-hidden overflow-y-auto">
                {children}
            </main>      
            <ToastContainer/>
        </div>
 
  )
}

export default InicioLayout