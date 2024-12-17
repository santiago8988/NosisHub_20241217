"use client"

import { Fragment, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { createHistoryAction, submitDocumentAction } from "@/app/_actions"
import { useSession } from "next-auth/react"

const DocumentForm = ({ organizationid,userEmail,areas }) => {
    const {data:session}=useSession()
    const [name, setName] = useState('');
    const [revision, setRevision] = useState('');
    const [email, setEmail] = useState(userEmail);
    const areaRef = useRef(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        const areaValue = areaRef.current.value;

        const document = {
            name: name,
            dueDate: "",
            revision: revision,
            area: areaValue,
            organization: organizationid,
            createdBy: email,
        }

        const response = await submitDocumentAction(document, 'create');

        if (response.status === 409) {
            toast(`${response.msg}`, {
                theme: 'colored',
                type: 'error',
                autoClose: 2500
            })
        } else if (response.status === 200) {
            const response2=await createHistoryAction(session?.user?.id,'creado',null,response.id);
            toast(`${response.msg}`, {
                theme: 'colored',
                type: 'success',
                autoClose: 2000
            })
            setTimeout(() => {
                router.push(`/document/${response.id}`);
                setName('')
            }, 2000);
        }
    }

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function handleDueDate(revision) {
        const currentDate = new Date();
        const dueDate = new Date(currentDate.getTime() + revision * 24 * 60 * 60 * 1000);
        return formatDate(dueDate);
    }

    return (
        <Fragment>
            <div className="mb-6 mt-6">
                <div className="bg-white shadow rounded-lg">

                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input 
                                    type="text" 
                                    id="nombre"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
                                <select 
                                    id="area" 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                                    ref={areaRef}
                                >
                                    <option value="">Elige...</option>
                                    {areas && areas.map(area => (
                                        <option key={area._id} value={area.name}>{area.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="revision" className="block text-sm font-medium text-gray-700">Revision</label>
                                <input 
                                    type="text" 
                                    id="revision"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={revision} 
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const validValue = inputValue.replace(/[^0-9]/g, '');
                                        setRevision(validValue);
                                    }} 
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Creador</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                                    defaultValue={userEmail} 
                                    readOnly 
                                />
                            </div>
                            <div className="text-center">
                                <button 
                                    type="submit" 
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default DocumentForm
