import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getOrganizationAction } from '../_actions';

const organization = async () => {

    const session = await getServerSession(authOptions)
    const organization=await getOrganizationAction(session?.user?.organization)

  if (session && session.user?.organization) {
    redirect(`/organization/${session.user.organization}`); // Redirigir al usuario
  }
  return (
    <div>
      Loading...
    </div>
  );
};

export default organization;
