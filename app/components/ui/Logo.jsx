import React from 'react'
import { Brain } from 'lucide-react'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/inicio" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
      <Brain className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">NosisHub</span>
    </Link>
  )
}

export default Logo
    {/*<div className="flex items-center space-x-2">
      <Brain className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">NosisHub</span>
    </div>*/}