import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongo/client'
import { NextResponse } from 'next/server'
import Record from '@/models/record'
import AllowedUser from '@/models/allowedUser'
import connectToDB from '@/config/connectToDB'
import mongoose from 'mongoose'
import organization from '@/app/organization/page'

let client
let db
let records

async function init() {
  if (db) return
  try {
    client = await clientPromise
    db = await client.db()
    records = await db.collection('records')
  } catch (error) {
    throw new Error('Failed to stablish connection to database')
  }
}


/////////////
/// RECORDS///
/////////////
export async function getActiveRecords(organizationId) {
  
  try {
    if (!records) {
      await init(); // Asegúrate de que esta función inicializa correctamente la conexión a la base de datos
    }
    
    const query = { 
      isActive: true, 
      organization: new ObjectId(organizationId)
    };
     
    const recordList = await records.find(query).toArray();
  
    if (!recordList || recordList.length === 0) {
      console.log('No active records found');
      return NextResponse.json({ status: 204, message: 'No active records found' });
    }
    
    // Convertir _id a string para cada registro
    const formattedRecords = recordList.map(record => ({
      ...record,
      _id: record._id.toString()
    }));
    
    return NextResponse.json({ status: 200, records: formattedRecords });
  } catch (error) {
    console.error('Error fetching active records:', error);
    return NextResponse.json({ status: 500, error: 'Failed to fetch active records.' });
  }
}

export async function getActiveRecordsNames(organizationid){
  try {
    if (!records) await init()
      const recordList = await records.find({ isActive: true,organization:organizationid }, { projection: { name: 1, own: 1 } }).toArray();
      if(!recordList) throw new Error();
      return NextResponse.json({status:200,records:recordList})
      /*return { recordList: recordList.map(record => ({ ...record, _id: record._id.toString() })) };*/
  } catch (error) {
    return { error: 'Failed to find user records.' }
  }
}


export async function getRecordName(recordId) {
  try {
    await connectToDB();
    const recordObjectId = new mongoose.Types.ObjectId(recordId);
    
    const record = await Record.findById(recordObjectId).select('name');
    
    return record ? record.name : null;
  } catch (error) {
    console.error('Error in getRecordName:', error);
    throw error; // Propagate the error to be handled by the server action
  }
}

export async function getRecordByName(recordName,organizationId){
  try {
    await connectToDB()
    const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId)
    return await Record.find({ organization: organizationIdObjectId,name:recordName,isActive:true })
  } catch (error) {
    console.error('Error en getRecordByName:', error)
    throw error // Propagamos el error para manejarlo en la acción del servidor
  }
}

export async function getRecordsByUserEmail(userEmail){
   
    try {
          await connectToDB()

            // Buscar el usuario por correo electrónico para obtener su ID
            const user = await AllowedUser.findOne({ email: userEmail });
  
            if (!user) throw new Error('User not found');
            
            const userId = user._id

            const recordList = await Record.find({
              isActive: true, // Recupera registros que tengan isActive establecido en true
              $or: [
                  { createdBy: userId }, // Recupera registros donde el campo createdBy sea igual al ID del usuario
                  { collaborators: userId } // Recupera registros donde el array collaborators contenga el ID del usuario
              ]
          }).populate('createdBy', 'email')
            .populate('collaborators', 'email fullName position area')
            .exec();

        // Convertir los documentos Mongoose a objetos JavaScript planos
        const plainRecordList = recordList.map(record => record.toObject());

        if (!plainRecordList.length) return NextResponse.json({ msg: 'No se encontraron registros.',status:404,records:[] })
        return NextResponse.json({ msg: 'No se encontraron registros.',status:404,records:plainRecordList.map(record => ({ ...record, _id: record._id.toString() })) })
        

    } catch (error) {
      return NextResponse.json({ msg: 'Error del servidor.',status:404,records:[] })
    }
}

export async function getRecordsObsoleteByUserEmail(userEmail){
   
  try {
        await connectToDB()

          // Buscar el usuario por correo electrónico para obtener su ID
          const user = await AllowedUser.findOne({ email: userEmail });

          if (!user) throw new Error('User not found');
          
          const userId = user._id

          const recordList = await Record.find({
            isActive: false, // Recupera registros que tengan isActive establecido en true
            $or: [
                { createdBy: userId }, // Recupera registros donde el campo createdBy sea igual al ID del usuario
                { collaborators: userId } // Recupera registros donde el array collaborators contenga el ID del usuario
            ]
        }).populate('createdBy', 'email')
          .populate('collaborators', 'email fullName position area')
          .exec();

      // Convertir los documentos Mongoose a objetos JavaScript planos
      const plainRecordList = recordList.map(record => record.toObject());

      if (!plainRecordList.length) return NextResponse.json({ msg: 'No se encontraron registros.',status:404,records:[] })
      return NextResponse.json({ msg: 'No se encontraron registros.',status:404,records :plainRecordList.map(record => ({ ...record, _id: record._id.toString() })) })
      
  } catch (error) {
    return NextResponse.json({ msg: 'Error del servidor',status:500,records:[] })
  }
}

export async function getRecordsByUserEmail2(userId, queryUser = '', page, limit) {
  try {
    await connectToDB()
    
    const userIdObjectId = new mongoose.Types.ObjectId(userId)
    const skip = (page - 1) * limit

    // Base pipeline
    const pipeline = [
      {
        $match: {
          isActive: true,
          $or: [
            { createdBy: userIdObjectId },
            { collaborators: userIdObjectId }
          ]
        }
      }
    ]

    // Add search if queryUser is provided
    if (queryUser.trim() !== "") {
      pipeline.unshift({ 
        $search: { 
          index: "recordName", 
          autocomplete: { 
            query: queryUser, 
            path: "name" 
          } 
        } 
      })
    }

    // Count total documents before pagination
    const countPipeline = [...pipeline, { $count: "total" }]
    const [countResult] = await Record.aggregate(countPipeline)
    const total = countResult ? countResult.total : 0

    // Add pagination to the main pipeline
    pipeline.push({ $skip: skip }, { $limit: limit })

    // Add lookups and projections
    pipeline.push(
      {
        $lookup: {
          from: 'allowedusers',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByData'
        }
      },
      {
        $lookup: {
          from: 'allowedusers',
          localField: 'collaborators',
          foreignField: '_id',
          as: 'collaboratorsData'
        }
      },
      { $unwind: '$createdByData' },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          createdBy: '$createdByData.email',
          collaborators: {
            $map: {
              input: '$collaboratorsData',
              as: 'collaborator',
              in: {
                email: '$$collaborator.email',
                fullName: '$$collaborator.fullName',
                position: '$$collaborator.position',
                area: '$$collaborator.area'
              }
            }
          }
        }
      }
    )

    const recordList = await Record.aggregate(pipeline)

    if (recordList.length === 0) {
      return NextResponse.json({ 
        msg: 'No se encontraron registros.', 
        status: 404, 
        records: [],
        total: 0
      })
    }

    return NextResponse.json({ 
      msg: 'Registros encontrados.', 
      status: 200, 
      records: recordList.map(record => ({ ...record, _id: record._id.toString() })),
      total: total
    })
     
  } catch (error) {
    console.error('Error in getRecordsByUserEmail2:', error)
    return NextResponse.json({ msg: 'Error del servidor.', status: 500, records: [], total: 0 })
  }
}

export async function getRecordsObsoleteByUserEmail2(userId,queryUser='',page,limit){
   
  try {
        await connectToDB()
          
          const userIdObjectId = new mongoose.Types.ObjectId(userId);
          const skip = (page - 1) * limit; // Calcula el número de documentos a saltar

          const pipeline = [
            { $match: { isActive: false } },
            {
              $match: {
                $or: [
                  { createdBy: userIdObjectId },
                  { collaborators: userIdObjectId }
                ]
              }
            },
            // Lookup para obtener los datos de los usuarios
            {
              $lookup: {
                from: 'allowedusers', // Nombre de la colección de usuarios
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdByData'
              }
            },
            {
              $lookup: {
                from: 'allowedusers',
                localField: 'collaborators',
                foreignField: '_id',
                as: 'collaboratorsData'
              }
            },
            // Unwind para convertir los arrays en objetos individuales
            { $unwind: '$createdByData' },
            /*{ $unwind: { path: '$collaboratorsData', preserveNullAndEmptyArrays: true } }, // Permitir colaboradores vacíos*/
            { $skip: skip },
            { $limit: limit }
          ];
      
          if (queryUser.trim() !== "") {
            pipeline.unshift({ $search: { index: "recordName", autocomplete: { query: queryUser, path: "name" } } });
          }   
          // Proyectar solo los campos necesarios
          pipeline.push({
            $project: {
              _id: 1,
              name: 1,
              status: 1,
              createdBy: '$createdByData.email',
              collaborators: {
                $map: { // Usar $map para transformar el array de colaboradores
                  input: '$collaboratorsData',
                  as: 'collaborator',
                  in: {
                    email: '$$collaborator.email',
                    fullName: '$$collaborator.fullName',
                    position: '$$collaborator.position',
                    area: '$$collaborator.area'
                  }
                }
              }
            }
          });
      
          const recordList = await Record.aggregate(pipeline);

      // Convertir los documentos Mongoose a objetos JavaScript planos
     

      if (!recordList) return NextResponse.json({ msg: 'No se encontraron registros.',status:404,records:[] });

      return NextResponse.json({ msg: 'Se encontraron registros.',status:200,records:recordList })

  } catch (error) {
       return NextResponse.json({ msg: 'Error del servidor',status:500,records:[] })
  }
}

export async function getRecordById(recordid){
  try {
      await connectToDB()
      const record = await Record.findById(recordid)
        .populate({
          path: 'collaborators',
          model: 'AllowedUser',
          select: 'email fullName position area'
        })
        .populate({
          path: 'createdBy',
          model: 'AllowedUser',
          select: 'email'
        })
        .exec();

      if(!record) throw new Error();
      return NextResponse.json({status:200,record:record})
      /*return { recordList: recordList.map(record => ({ ...record, _id: record._id.toString() })) };*/
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: 'No se encontró el registro.',status:404 })
  }
}

export async function createRecord(recordObject){
  try {
    /*if (!records) await init()*/
        await connectToDB()
        if(recordObject._id){
              const currentVersion=recordObject.version || 0
              recordObject.version=currentVersion+1;
              const { _id, ...newRecordObject } = recordObject;
              const recordMongo = new Record(newRecordObject);
              const recordSaved=JSON.parse(JSON.stringify(await recordMongo.save()))
              if(!recordSaved) throw new Error();
              return NextResponse.json({ message: 'Registro creado.',status: 200,recordId : recordSaved._id.toString() });
        }else{
            const recordMongo = new Record(recordObject);
            console.log('recordMongo',recordMongo)
            const recordSaved=JSON.parse(JSON.stringify(await recordMongo.save()))
            if(!recordSaved) throw new Error();
            return NextResponse.json({ message: 'Registro creado.',status: 200,recordId : recordSaved._id.toString() });
        }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Failed to create record.',status:400 })
  }
}

export async function inactiveRecord(id){
  try {
      await connectToDB();
      const record = await Record.findById(id);
      record.isActive = false;
      const recordUpdated = await record.save()
      return NextResponse.json({ message: 'Registro inactivado',status: 200 }, { status: 200 })     
  } catch (error) {
      return NextResponse.json({ message: 'Error en el servidor', status: 500 });
  }
}

export async function addCollaborators(id, newCollaborators) {
  try {
      await connectToDB();

      // Validar id y newCollaborators
      if (!id || !Array.isArray(newCollaborators)) {
          return NextResponse.json({ message: 'Entrada no válida.', status: 400 }, { status: 400 });
      }

      const record = await Record.findById(id);
      if (!record) {
          return NextResponse.json({ message: 'Registro no encontrado', status: 404 }, { status: 404 });
      }

      // Usar un Set para evitar duplicados de manera más eficiente
      const existingCollaborators = new Set(record.collaborators);
      newCollaborators.forEach(userId => {
          existingCollaborators.add(userId);
      });

      record.collaborators = Array.from(existingCollaborators);
      const recordUpdated = await record.save();

      return NextResponse.json({ message: 'Colaboradores agregados.', status: 200, record: recordUpdated }, { status: 200 });
  } catch (error) {
      console.error('Error adding collaborators:', error);
      return NextResponse.json({ message: 'Internal Server Error', status: 500 }, { status: 500 });
  }
}

export async function deleteCollaborator(collaboratorid,recordid){
    try {
        await connectToDB();

        const record = await Record.findById(recordid);
        if (!record) {
            return NextResponse.json({ message: 'Registro no encontrado', status: 404 }, { status: 404 });
        }
        // Elimina el colaborador de la lista de colaboradores
        record.collaborators.pull(collaboratorid);
        const recordUpdated = await record.save();

        return NextResponse.json({ message: 'Colaboradores agregados.', status: 200, record: recordUpdated }, { status: 200 });
    } catch (error) {
        console.error('Error adding collaborators:', error);
        return NextResponse.json({ message: 'Internal Server Error', status: 500 }, { status: 500 });
    }
}
