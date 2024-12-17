'use client'
import React from 'react'
import { usePathname } from "next/navigation"
import { Calculator, Book, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const DocSidebar = ({ items = [], botItems = [] }) => {
  const pathname = usePathname()

  const NavItem = ({ item }) => (
    <a
      href={item.href}
      className={`block py-2 px-4 rounded-lg ${
        pathname === item.href
          ? 'bg-blue-100 text-blue-600 font-medium'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {item.icon}
      {item.label}
    </a>
  )

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-100 flex flex-col overflow-y-auto">
      <nav className="p-4 space-y-2 flex-grow">
        {items.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>
      <div className="p-4 space-y-2 border-t border-gray-200">
        {botItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
        <button
          onClick={() => signOut()}
          className="block w-full text-left py-2 px-4 rounded-lg text-red-600 hover:bg-red-100"
        >
          <LogOut className="inline-block mr-2 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}

export default DocSidebar