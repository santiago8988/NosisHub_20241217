import { getServerSession} from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getOrganizationAction } from "../_actions"

import { ToastContainer } from "react-toastify"
import Sidebar2 from "../components/ui/SideBar2"
import { House,Calculator,Book,CookingPot,ChartNoAxesGantt,LogOut,ScanEye,ShoppingBasket } from "lucide-react"
import { LogIn } from "lucide-react"

const items=[
    {
        label:'Materias Primas',
        href:'/produccion/materias-primas',
        icon: <ShoppingBasket className="inline-block mr-2 h-5 w-5" />
    },
    {
        label:'Recetas',
        href:'/produccion/recetas',
        icon: <CookingPot className="inline-block mr-2 h-5 w-5"/>
    },
    {
        label:'Órdenes de Prod.',
        href:'/produccion/ordenes-produccion',
        icon: <ChartNoAxesGantt className="inline-block mr-2 h-5 w-5"/>
    },
    {
      label:'Ingreso Materias',
      href:'/produccion/ingreso-materias',
      icon: <LogIn className="inline-block mr-2 h-5 w-5" />
  },
    {
        label:'Egreso',
        href:'/produccion/egreso-producto',
        icon: <LogOut className="inline-block mr-2 h-5 w-5"/>
    },
    {
        label:'Calidad',
        href:'/produccion/control-calidad',
        icon: <ScanEye className="inline-block mr-2 h-5 w-5" />
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


const ProduccionLayout = async ({children}) => {

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

export default ProduccionLayout
