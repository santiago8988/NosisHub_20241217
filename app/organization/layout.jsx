import { getServerSession} from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getOrganizationAction } from "../_actions"

import { ToastContainer } from "react-toastify"
import Sidebar2 from "../components/ui/SideBar2"
import { House,Calculator,Book } from "lucide-react"

const items=[
    {
        label:'Inicio',
        href:'/inicio',
        icon: <House className="inline-block mr-2 h-5 w-5" />
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


const OrganizationLayout = async ({children}) => {

  const session = await getServerSession(authOptions)
  let organization = null

  if (session?.user?.organization) {
    organization = await getOrganizationAction(session.user.organization)
  }

  return (
    <div className="flex min-h-screen">
      {/*<Sidebar items={items}/>*/}      
      {<Sidebar2  items={items} botItems={botitems} name={session?.user?.name} organization={organization?.data?.name}/>}     
      <main className="flex-1 ml-64 overflow-x-hidden overflow-y-auto">
              {children}
      </main> 
      <ToastContainer/>
    </div>
  )
}

export default OrganizationLayout
