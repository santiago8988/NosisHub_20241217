"use client"
import React, { Fragment, useState } from 'react';
import Base64ToPdf from '../ui/Base64ToPdf';
import DaysLeft from '../ui/DaysLeft';
import UserProfileImage from '../allowedUsers/UserProfileImage';
import ActionMenu from './ActionMenu';

/*import EntrieObsoleteModal from './Entries/EntrieObsoleteModal';
import EntrieObsoleteOffCanvas from './Entries/EntrieObsoleteOffCanvas';*/

const EntrieTableRow = ({index,entrie,values,dueDate,completed,_id,completedBy,isActive,record}) => {

        const [modalShow,setModalShow]=useState(false);

        const handleModal=()=>{
            setModalShow(!modalShow)
        }

  
  return (
    <Fragment>
        {values ? 
        ( <Fragment>
                <tr className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="py-4 px-6 text-sm text-gray-500">{isActive ? (<span className=" badge bg-success text-green-600">Si</span>):(<span className="badge bg-gray-500 text-white">NO</span>)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{completed  ? (<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"> COMPLETA</span>):(<span ><DaysLeft entry={entrie}/></span>)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500"> {completedBy ?<UserProfileImage email={completedBy}/> : ''}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{dueDate}</td>
                    {Object.entries(values).map(([key, value]) => (
                        <React.Fragment key={key} >
                            {typeof value === 'object' ? (
                                Object.entries(value).map(([subKey, subValue]) => (
                                    <td key={subKey} className="py-4 px-6 text-sm text-gray-500">{`${subValue}`}</td>
                                ))
                            ) : (
                                <td className='py-4 px-6 text-sm text-gray-500'>{`${value}`}</td>
                            )}
                        </React.Fragment>
                    ))}

                    <td className='py-4 px-6 text-sm text-gray-500'>
                        {
                            entrie?.pdf ? (<Base64ToPdf base64Data={entrie.pdf} fileName={`Entrada_${entrie._id}`}/>) 
                                        : (null)
                        }
                        
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                            <ActionMenu isActive={isActive} completed={completed} entrie={entrie}/>
                    </td>
                </tr>
                {/*<EntrieObsoleteModal show={modalShow} entrieid={_id} entrie={entrie} onHide={()=>setModalShow(false)} />*/}
          
          </Fragment> 
        ) : (null)}

  </Fragment>

  )
}

export default EntrieTableRow