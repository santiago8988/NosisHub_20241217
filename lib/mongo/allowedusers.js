import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongo/client'
import connectToDB from '@/config/connectToDB'
import organization from '@/app/organization/page'
import AllowedUser from '@/models/allowedUser'
import { NextResponse } from 'next/server'

let client
let db
let allowedusers

async function init() {
  if (db) return
  try {
    client = await clientPromise
    db = await client.db()
    allowedusers = await db.collection('allowedusers')
  } catch (error) {
    throw new Error('Failed to stablish connection to database')
  }
}


/////////////
/// ALLOWED USER ///
/////////////

export async function findAllowedUserByEmail(email) {
    try {
      if (!allowedusers) await init()
  
      const alloweduser = await allowedusers.findOne({ email })
  
      if (!alloweduser) throw new Error();

      return { alloweduser: { ...alloweduser, _id: alloweduser._id.toString() } }
    } catch (error) {
      return { error: 'Failed to find the allowed user.' }
    }
  }


  export async function isUserAllowed(userEmail){

    try {
        if (!allowedusers) await init()
        const user = await allowedusers.findOne({email:userEmail})
        if(user && user.isActive){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        return {error}
    }
}

export async function getAttributes(userEmail){

  try {
      if (!allowedusers) await init()
      const user = await allowedusers.findOne({email:userEmail})
      if (user) {
          return {
            id:user._id.toString(),
            area: user.area,
            position: user.position,
            role: user.role,
            organization:user.organization.toString(),
            // Agrega más atributos según sea necesario
          };
        } else {
          // Si el usuario no se encuentra, puedes retornar un objeto vacío o un mensaje de error
          return {};
        }
  } catch (error) {
      return {error}
  }
}


export async function getAllowedUsers(organizationid){

  try {
    await connectToDB()
    const list = await AllowedUser.find({organization:organizationid})

    if(!list) throw new Error();
    return NextResponse.json({  status:200,userList: list})
  } catch (error) {
    console.log(error)
    return NextResponse.json({status:500, error: 'Failed to find the users.' })
  }
}

export async function changeUserStatus(userid){
  try {
    await connectToDB()
    const user = await AllowedUser.findById(userid)
    if(!user) throw new Error();
    if(user.isActive==='active'){
      user.isActive='inactive'
    }else{
      user.isActive='active'
    }
    await user.save()
    return NextResponse.json({ isActive: user.isActive==='active'? true: false ,msg:'Usuario actualizado.',status:200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({ isActive: user.isActive==='active'? true: false, msg: 'Failed to find the users.',status:500})
  }
}

export async function createUser(newUser){
  try {
    await connectToDB();
    const userMongo= new AllowedUser(newUser)
    const userSaved= await userMongo.save();
    if(!userSaved) throw new Error();
    return NextResponse.json({user:userSaved,status:200,msg:'Usuario creado.'})
  } catch (error) {
    return NextResponse.json({status:500,msg:'Falló la creación del usuario.'})
  }
}