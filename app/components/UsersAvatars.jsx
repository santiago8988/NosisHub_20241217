import React from 'react'
import UserProfileImage from './allowedUsers/UserProfileImage'

const UsersAvatars = ({userList}) => {
  return (
      <div className="flex -space-x-2 overflow-visible">
        {userList.map((user, index) => (
          <div key={user._id} className="relative z-0 hover:z-10 transition-all duration-200 ease-in-out" style={{ marginLeft: index > 0 ? '-0.5rem' : '0' }}>
            <UserProfileImage email={user.email} />
          </div>
        ))}
      </div>
  )
}

export default UsersAvatars
    {/*<div className="flex -space-x-2 overflow-hidden">
            {userList.map((user)=>{
               return <UserProfileImage email={user.email} key={user._id}/>
            })}
    </div>*/}