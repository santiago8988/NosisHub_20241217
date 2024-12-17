

export default function RootParalelLayout ({children,recordinfo,collaborators,entries})  {
  return (
    <main className="flex-1 overflow-y-auto p-6">
          {children}

       <div className="flex gap-6 mb-8 h-[50vh]">
            <div className="w-1/2 h-full overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Información del registro</h2>
              <div className="bg-white p-4 rounded-lg shadow h-full">{recordinfo}</div>
            </div>
            <div className="w-1/2 h-full overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Colaboradores</h2>
              <div className="bg-white p-4 rounded-lg shadow h-full">{collaborators}</div>
              </div>
            </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Entradas</h2>
            <div className="bg-white p-4 rounded-lg shadow">{entries}</div>
          </div>    
    </main>

  )
}