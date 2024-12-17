'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogOut, HomeIcon as House } from 'lucide-react'
import { signOut } from 'next-auth/react'

const DocSidebar = ({ items, botItems = [] }) => {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState([])
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    // Open all sections by default when on the documentation page
    if (pathname === '/documentation') {
      setOpenSections(items.map(item => item.label))
    }

    // Set up intersection observer to update active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observe all section elements
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [pathname, items])

  const toggleSection = (label) => {
    setOpenSections(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const scrollToSection = (e, href) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', href)
    }
  }

  const links = [
    {
      label: 'Inicio',
      href: '/inicio',
      icon: <House className="inline-block mr-2 h-5 w-5" />
    },
  ]

  const NavItemLink = ({ link }) => (
    <Link
      href={link.href}
      className={`block py-2 px-4 rounded-lg ${
        pathname === link.href
          ? 'bg-blue-100 text-blue-600 font-medium'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {link.icon}
      {link.label}
    </Link>
  )

  const NavItem = ({ item, onClick, isOpen }) => (
    <div>
      <button
        onClick={onClick}
        className={`flex items-center justify-between w-full py-2 px-4 rounded-lg ${
          pathname === '/documentation' && activeSection === item.id
            ? 'bg-blue-100 text-blue-600 font-medium'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="flex items-center">
          {item.icon}
          {item.label}
        </span>
        {item.items && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </button>
      {isOpen && item.items && (
        <div className="ml-4 mt-2 space-y-2">
          {item.items.map((subItem, index) => (
            <a
              key={index}
              href={`#${subItem.id}`}
              onClick={(e) => scrollToSection(e, `#${subItem.id}`)}
              className={`block py-2 px-4 rounded-lg ${
                activeSection === subItem.id
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subItem.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-100 flex flex-col overflow-y-auto">
      <nav className="p-4 space-y-2 flex-grow">
        {links.map((link, index) => (
          <NavItemLink key={link.label} link={link} />
        ))}
        {items.map((item, index) => (
          <NavItem
            key={index}
            item={item}
            onClick={() => toggleSection(item.label)}
            isOpen={openSections.includes(item.label)}
          />
        ))}
      </nav>
      <div className="p-4 space-y-2 border-t border-gray-200">
        {botItems.map((item, index) => (
          <NavItemLink key={index} link={item} />
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


/*'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogOut,House } from 'lucide-react'
import { signOut } from 'next-auth/react'

const DocSidebar = ({ items, botItems = [] }) => {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState([])

  const toggleSection = (label) => {
    setOpenSections(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const links=[
    {
        label:'Inicio',
        href:'/inicio',
        icon: <House className="inline-block mr-2 h-5 w-5" />
    },
]
  const NavItemLink = ({ link }) => (
    <a
      href={link.href}
      className={`block py-2 px-4 rounded-lg ${
        pathname === link.href
          ? 'bg-blue-100 text-blue-600 font-medium'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {link.icon}
      {link.label}
    </a>
  )

  const NavItem = ({ item, onClick, isOpen }) => (
    <div>
      <button
        onClick={onClick}
        className={`flex items-center justify-between w-full py-2 px-4 rounded-lg ${
          pathname.startsWith(item.href)
            ? 'bg-blue-100 text-blue-600 font-medium'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="flex items-center">
          {item.icon}
          {item.label}
        </span>
        {item.items && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </button>
      {isOpen && item.items && (
        <div className="ml-4 mt-2 space-y-2">
          {item.items.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block py-2 px-4 rounded-lg ${
                pathname === subItem.href
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-100 flex flex-col overflow-y-auto">
      <nav className="p-4 space-y-2 flex-grow">
        {links.map((link,index)=>(
            <NavItemLink key={link.label} link={link}/>
        ))}
        {items.map((item, index) => (
          <NavItem
            key={index}
            item={item}
            onClick={() => toggleSection(item.label)}
            isOpen={openSections.includes(item.label)}
          />
        ))}
      </nav>
      <div className="p-4 space-y-2 border-t border-gray-200">
        {botItems.map((item, index) => (
          <NavItemLink key={index} link={item} />
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

export default DocSidebar*/