'use client'
import React, { useState } from 'react';
import UserProfileImage from '../allowedUsers/UserProfileImage';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; 

const ActivityTimeline = ({ activities,status}) => {
  const [newComment, setNewComment] = useState('');
  const { data: session } = useSession();
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = () => {
    // Lógica para agregar el nuevo comentario a la lista de actividades
    // ...
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <ul className="list-none mb-10">
        {activities.map((activity, index) => (
          <li key={index} className="mb-4 relative pl-8">
            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-400" />
            <div className="flex items-start gap-2">
              {activity.userImage ? (
                <img
                  src={activity.userImage}
                  alt={`${activity.userName} avatar`}
                  className="w-6 h-6 rounded-full mr-2"
                />
              ): <UserProfileImage email={activity?.user?.email}/>}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {activity.user.email} ha {activity.action} el documento
                </p>
                {activity.comment && (
                  <p className="text-sm text-gray-500">{activity.comment}</p>
                )}
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center mt-4 gap-2">
          <UserProfileImage email={session?.user?.email}/>
        <input
          type="text"
          placeholder="Agregar tu comentario..."
          value={newComment}
          onChange={handleCommentChange}
          readOnly={status === 'obsolete'}
          className="flex-grow border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleAddComment}
          className={`rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 
                      ${status === 'obsolete' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={status === 'obsolete'}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;
