

export default function RootOrganizationLayout ({children,allowedusers,areas,qa})  {
    
    return (
      <>
           <main className="flex-1 overflow-y-auto p-6">
                {children}
                <div className="flex gap-6 mb-8 h-[50vh]">
                    <div className="w-1/2 h-full overflow-y-auto">
                    <div className="bg-white p-4 rounded-lg shadow h-full">{areas}</div>
                    </div>
                    <div className="w-1/2 h-full overflow-y-auto">
                    <div className="bg-white p-4 rounded-lg shadow h-full">{qa}</div>
                    </div>
                </div>

                {/* Document content */}
                <div>
                    <div className="bg-white p-4 rounded-lg shadow">{allowedusers}</div>
                </div>
            </main>
      </>
  
    )
  }
  