import Provider from './components/Provider'
import Header from './components/Header'
import Footer from './components/Footer'
import { Inter as FontSans} from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

/*const inter = Inter({ subsets: ['latin'] })*/

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'NosisHub App',
  description: 'Estás en NosisHub, bievenido!'
}

export default function RootLayout({ children}) {
  return (
    <html lang='en'>
{<Provider>
        <body 
          className={cn(
            "flex flex-col min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Header className="flex-shrink-0" />
          <main className='flex-1 overflow-y-auto bg-white p-5'>{children}</main>
          <Footer className="flex-shrink-0" />
        </body>
      </Provider>}
    </html>
  )
}
