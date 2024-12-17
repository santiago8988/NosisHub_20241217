import { getRecordByIdAction } from "@/app/_actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserProfileForm from "@/app/components/UserProfileForm";
import UserProfileImage from "@/app/components/allowedUsers/UserProfileImage";
import DeleteCollaboratorButton from "@/app/components/records/DeleteCollaboratorButton";
import ButtonAddCollaborator from "@/app/components/records/ButtonAddCollaborator";
import { convertToPlainObject } from "@/lib/utils/utils";

const Collaborators = async ({ params }) => {

  const data = await getRecordByIdAction(params.id);

  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-gray-50 px-4 sm:px-0 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Colaboradores
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Lista de colaboradores.
          </p>
        </div>
        <div>
          {data?.record?.isActive && <ButtonAddCollaborator record={convertToPlainObject(data?.record)}/>}
        </div>
      </div>
      <div className="mt-10 border-t border-gray-100">
        <ul role="list" className="divide-y divide-gray-100 w-full">
          {data?.record && convertToPlainObject(data?.record?.collaborators).map((person) => (
            <li key={person.email} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                 {<UserProfileImage email={person.email}/>}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {person.fullName}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {person.email}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  {<DeleteCollaboratorButton collaboratorid={person._id} recordid={data?.record?._id}/>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Collaborators;