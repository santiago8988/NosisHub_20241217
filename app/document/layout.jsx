import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getOrganizationAction } from "../_actions"
import { ToastContainer } from "react-toastify"
import { List,FilePlus,Calculator,Book,Wrench,Trash2} from "lucide-react"
import Sidebar2 from "../components/ui/SideBar2"

const itemsAdmin=[
    {
        label:'Listar',
        href:'/document',
        icon: <List className="inline-block mr-2 h-5 w-5" />
    },
    {
      label:'En construcción',
      href:'/document/constructionDocuments',
      icon: <Wrench className="inline-block mr-2 h-5 w-5" />
    },
    {
      label:'Obsoletos',
      href:'/document/obsolete',
      icon: <Trash2 className="inline-block mr-2 h-5 w-5" />
    },
    {
        label:'Crear',
        href:'/document/NewDocument',
        icon: <FilePlus className="inline-block mr-2 h-5 w-5" />
    },
]

const itemsUser=[
  {
      label:'Listar',
      href:'/document',
      icon: <List className="inline-block mr-2 h-5 w-5" />
  },
  {
    label:'Obsoletos',
    href:'/document/obsolete',
    icon: <Trash2 className="inline-block mr-2 h-5 w-5" />
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

const DocumentLayout = async ({children}) => {
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

export default DocumentLayout