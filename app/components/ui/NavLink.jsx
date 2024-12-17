'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLink = ({href,...rest}) => {

    const pathname=usePathname()
    const isActive= href === pathname

  return  <Link 
             className={isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}
             href={href} {...rest}/>
  
}

export default NavLink