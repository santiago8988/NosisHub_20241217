
import SignInButton from './SignInButton'
import NavLink from './ui/NavLink'
import Logo from './ui/Logo'

const Header = () => {
  return (

<header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold"><Logo/></span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <NavLink href='/inicio'>Inicio</NavLink>
            <NavLink href='/RecordList'>Registros</NavLink>
            <NavLink href='/document'>Documentos</NavLink>
            <NavLink href='/organization'>Organización</NavLink>
            <NavLink href='/inicio/admin'>Admin</NavLink>
          </nav>
          <div className="flex-shrink-0">
              <SignInButton/>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
