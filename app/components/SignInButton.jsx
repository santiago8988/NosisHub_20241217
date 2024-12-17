'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Popover } from '@headlessui/react'
import { Settings, LogOut } from 'lucide-react'

const SignInButton = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (!session) {
    return (
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    )
  }

  return (
    <Popover className="relative">
      <Popover.Button
        className="flex items-center space-x-3 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
        </div>
        <span className="text-sm font-medium text-gray-700">{session.user.name || 'User'}</span>
      </Popover.Button>

      <Popover.Panel
        className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
        <Link
          href="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-400" />
          Manage Account
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Sign Out
        </button>
      </Popover.Panel>
    </Popover>
  )
}

export default SignInButton