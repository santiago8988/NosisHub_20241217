import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import UserProfileCard from "@/components/ui/UserProfileCard"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Perfil</h1>
      <UserProfileCard user={session?.user} />
    </div>
  )
}