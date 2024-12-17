
export default function RootDocumentLayout ({children,content,whoaccess,info})  {
    return (
      <main className="flex-1 overflow-y-auto p-6">
          {children}
          <div className="flex gap-6 mb-8 h-[50vh]">
            <div className="w-1/2 h-full overflow-y-auto">
              <div className="bg-white p-4 rounded-lg shadow h-full">{info}</div>
            </div>
            <div className="w-1/2 h-full overflow-y-auto">
              <div className="bg-white p-4 rounded-lg shadow h-full">{whoaccess}</div>
            </div>
          </div>

          {/* Document content */}
          <div>
            <div className="bg-white p-4 rounded-lg shadow">{content}</div>
          </div>
      </main>
  
    )
  }
  