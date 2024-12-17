import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';


const Home= async ()=> {
  const session = await getServerSession(authOptions)

  if (session && session?.user) {
    redirect(`/inicio`);
  }

  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='text-2xl font-semibold tracking-tight'>Loading...</h1>
      </div>
    </section>
  )
}

export default Home
