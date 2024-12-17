'use client'
import { getImgByUserEmailAction } from '@/app/_actions';
import Image from 'next/image';
import React,{useState,useEffect} from 'react'
import {Tooltip,TooltipTrigger,TooltipContent,TooltipProvider} from '../../../components/ui/tooltip'

const UserProfileImage = ({email}) => {

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      async function fetchImage() {
        try {
          const  image  = await getImgByUserEmailAction(email);
          setImageUrl(image);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }
  
      fetchImage();
    }, [email]);
   
    return (
      <TooltipProvider>
        <Tooltip>
              <TooltipTrigger>
                <div className="relative inline-block">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-50 object-cover"
                    src={imageUrl || '/placeholder-avatar.png'}
                    alt={`Avatar de ${email}`}
                    />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{email}</p>
              </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

export default UserProfileImage

     {/* <div className="relative">
        <img
          className="h-10 w-10 flex-none rounded-full bg-gray-50"
          src={imageUrl}
          alt="userImage"
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out cursor-pointer hover:opacity-100">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-center text-xs bg-white px-4 py-2 rounded-md">
          </div>
        </div>
      </div>*/}