'use client';
import { changeUserStatusAction } from '@/app/_actions';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

const ButtonUserStatus = ({ isActive, userid }) => {
  const { data: session } = useSession();
  const [isChecked, setIsChecked] = useState(isActive || false);


  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await changeUserStatusAction(
        session?.user?.organization, 
        userid
      );
      setIsChecked(response.isActive); 
    } catch (error) {
      console.error("Failed to change user status:", error);
    }
  };

  return (
      <button
        onClick={handleClick}
        className={`
          w-10 h-6 rounded-full transition relative cursor-pointer
          after:w-5 after:h-5 after:bg-white after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2 after:rounded-full 
          after:transition-all
          ${isChecked ? 'bg-blue-600 after:left-[calc(100%-2px)] after:-translate-x-full' : 'bg-neutral-300 dark:bg-neutral-600'} 
        `}
      >
      </button>
  );
};

export default ButtonUserStatus;




/*'use client'
import { changeUserStatusAction } from '@/app/_actions';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const ButtonUserStatus = ({ isActive,userid }) => {
    const {data:session}=useSession()
    const [enabled, setEnabled] = useState(isActive);

  const handleClick = async (e) => {
    e.preventDefault()
    const response = await changeUserStatusAction(session?.user?.organization,userid)
    
  };

  return (
    <label>
      <input
        type="checkbox"
        className="absolute invisible w-0 h-0 peer"
        checked={isActive ? true :false }
        onClick={handleClick}
      />
      <div
        className="w-10 h-6 rounded-full bg-neutral-300 dark:bg-neutral-600 peer-checked:bg-blue-600 transition relative cursor-pointer
        before:w-5 before:h-5 before:bg-white before:absolute before:left-[2px] before:top-1/2 before:-translate-y-1/2  before:rounded-full 
        before:peer-checked:left-[calc(100%-2px)] before:peer-checked:-translate-x-full before:transition-all"
      ></div>
    </label>
  );
};

export default ButtonUserStatus;*/
