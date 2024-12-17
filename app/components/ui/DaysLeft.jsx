"use client"

import { useState,useEffect } from "react";

const DaysLeft = ({entry,}) => {

  const { dueDate} = entry;
  const [daysLeft, setDaysLeft] = useState(null);

 useEffect(() => {
    const currentDate = new Date();
    const entryDueDate = new Date(dueDate);
    const timeDiff = entryDueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysLeft(daysDiff);
  }, []);


  return (
      <>
          {daysLeft !== null ? 
              (
                daysLeft < 0 ? 
                    (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        VENCIDA
                      </span>
                    ) : 
                    (
                      daysLeft === 0 ? 
                      (
                          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            HOY
                          </span>
                      ) : 
                      (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                             {`Faltan ${daysLeft} días`}
                          </span>
                      )
                    )
              ) 
                : 
              (
                ''
              )}

          
      </>
  );
}

export default DaysLeft