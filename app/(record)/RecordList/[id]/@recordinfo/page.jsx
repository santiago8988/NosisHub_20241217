import { getRecordByIdAction, getRecordNameAction } from "@/app/_actions";
import ButtonNewVersion from "@/app/components/records/ButtonNewVersion";
import { convertToPlainObject } from "@/lib/utils/utils";
import { getServerSession } from "next-auth";
import { authOptions} from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

const recordinfo = async ({ params }) => {
  
  const session=await getServerSession(authOptions)
  const data = await getRecordByIdAction(params.id)

  if (data.status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ups algo salió mal.</h1>
          <p className="text-gray-600">El registro no existe.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  const checkAccess = (recordOwner, recordCollaborators) => {
    const currentUserId = session?.user?.id;
    if (currentUserId === recordOwner) {
      return true;
    }
    if (Array.isArray(recordCollaborators)) {
      return recordCollaborators.some(collaborator => collaborator._id === currentUserId);
    }
    return false;
  };


  const isOrganization= session?.user?.organization === data?.record?.organization
  const hasAccess=checkAccess(data?.record?.createdBy,data?.record?.collaborators)
  const isAdmin = session?.user?.role === 'admin'

  if (!isOrganization && ( !hasAccess || !isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado.</h1>
          <p className="text-gray-600">Lo siento, no tiene permisos para ingresar a esta sección.</p>
        </div>
        <Link href="/inicio" className="text-blue-600 hover:underline">
          Volver a Inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-gray-50 px-4 sm:px-0 flex justify-between items-center">
            <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Información del registro
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Creado por: {data?.record?.createdBy.email}
                </p>
            </div>
            <div>
               { data?.record?.isActive && <ButtonNewVersion recordid={convertToPlainObject(data?.record)?._id}/>}
            </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Nombre</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.record?.name}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Tipo</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.record?.type}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Periodicidad</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.record?.periodicity}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Notificar</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.record?.notify}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Campos</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0 mb-1">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {data?.record && Object.keys(data?.record?.own).length !== 0 ? (
                  Object.keys(data.record.own).map((field) => (
                    <li
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                      key={field}
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{field}:</span>
                          <span className="flex-shrink-0 text-gray-400">
                            {data.record.own[field].tipo}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Detalles
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Aún no hay campos propios configurados.
                        </span>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Identificador del registro
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200 mb-1"
              >
                {data?.record?.identifier.length !== 0 ? (
                  data?.record?.identifier.map((field) => (
                    <li
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                      key={field}
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{field}</span>
                          <span className="flex-shrink-0 text-gray-400">{}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Detalles
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Aún no hay identificadores configurados.
                        </span>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Acciones</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {data?.record?.actions.length !== 0 ? (
                  data?.record?.actions.map((action) => (
                    <li
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                      key={action.actionKey}
                    >
                      <div className="flex w-full items-center">
                        {/* Primer elemento */}
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{data?.record?.name}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                          </svg>
                        </div>
                        {/* Segundo elemento */}
                        <div className="ml-4 flex flex-col min-w-0">
                          <span className="truncate font-medium">
                            {action.writeOnRecord}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Detalles
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Aún no hay acciones configuradas.
                        </span>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Descripción</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data?.record?.description === '' ? 'N/A' : data?.record?.description}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default recordinfo;
