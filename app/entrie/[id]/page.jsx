import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getEntryAction } from "@/app/_actions"
import ViewOnlyEntrie from "@/app/components/entries/ViewOnlyEntrie"
import EntrieForm from "@/app/components/entries/EntrieForm"

export default async function EntriePage({ params }) {
  const session = await getServerSession(authOptions)
  const entrie = await getEntryAction(params.id)

  if (!session) {
    return <div>Access Denied</div>
  }

  if (entrie && (!entrie.isActive || entrie.completed)) {
    return <ViewOnlyEntrie entrie={entrie} />
  }

  return <EntrieForm entrie={entrie} session={session} />
}