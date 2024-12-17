'use server'

import { changeUserStatus, createUser, getAllowedUsers } from '@/lib/mongo/allowedusers';
import { getDocumentsByUser2,addFunctionalPdf, addParagraph, changeStatus, createDocument, deleteDocumentAccess, deleteParagraph, editParagraph, getDocumentById, getDocumentByName, getDocuments, getDocumentsByUser, setDocumentAccess, getDocumentToReview, getDocumentsNotPublishedByUser, getDocumentsNotPublishedByUser2, getDocumentsObsoleteByUser, getDocumentsObsoleteByUser2 } from '@/lib/mongo/documents';
import { complete, createEntry, getEntriesByOrganizationAdmin, getEntriesByRecord, getEntriesByRecordId, getEntriesByUser, getEntry, inactivateEntry, updateNextField } from '@/lib/mongo/entries';
import { createHistory, getHistoryByDocumentId } from '@/lib/mongo/history';
import { addArea, addQA, deleteArea, deleteQA, getAreas, getOrganization, getRoles } from '@/lib/mongo/organization';
import { addCollaborators, createRecord, deleteCollaborator, getActiveRecords, getActiveRecordsNames, getRecordById, getRecordsByUserEmail, getRecordsByUserEmail2, getRecordsObsoleteByUserEmail, getRecordsObsoleteByUserEmail2, inactiveRecord } from '@/lib/mongo/records'
import { findUserByEmail, updateUser,getImageByUserEmail } from '@/lib/mongo/users'
import { convertToPlainObject, DaysDifCurrentDate } from '@/lib/utils/utils';
import { revalidatePath } from 'next/cache';

export async function updateName(name, email) {
  await updateUser(email, { name })
}

////////////////////////////////////
//////////////RECORDS//////////////
///////////////////////////////////

export async function getRecordsByUserEmailAction(email){
   const response = await getRecordsByUserEmail(email);
   const data = await response.json()
    return data;
}

export async function getRecordsObsoleteByUserEmailAction(email){
  const response = await getRecordsObsoleteByUserEmail(email);
  const data = await response.json()
   return data;
}

export async function getRecordsByUserEmailAction2(userId,query,page,limit){
  const response = await getRecordsByUserEmail2(userId,query,page,limit);
  const data=await response.json()
   return data;
}

export async function getRecordsObsoleteByUserEmailAction2(userId,query,page,limit){
  const response = await getRecordsObsoleteByUserEmail2(userId,query,page,limit);
  const data = await response.json()
   return data;
}

export async function getRecordByIdAction(recordid){
  const response = await getRecordById(recordid)
  const fecth = await response.json()
  return fecth
}

export async function getActiveRecordsAction(){
  const response = await getActiveRecords()
  const list = await response.json()
  revalidatePath('/RecordList')
  return list;
}

export async function getActiveRecordsNamesAction(){
  const response = await getActiveRecordsNames()
  const list = await response.json()
  return list;
}


export async function createRecordAction(recordObject){
  
    const response= await createRecord(recordObject)
    const result= await response.json()
    return result;
}

export async function inactiveRecordAction(recordId){
  const response = await inactiveRecord(recordId)
  const result = await response.json();
  return result;
}

export async function addCollaboratorsAction(recordid,collaborators){
  const response=await  addCollaborators(recordid,collaborators)
  const data = await response.json()
  revalidatePath(`/RecordList/${recordid}`)
  return data;
}

export async function deleteCollaboratorsAction(collaboratorid,recordid){
  const response=await  deleteCollaborator(collaboratorid,recordid)
  const data = await response.json()
  revalidatePath(`/RecordList/${recordid}`)
  return data;
}


////////////////////////////////////
//////////////ENTRIES//////////////
///////////////////////////////////

export async function getEntriesByRecordIdAction(recordid){
      const response=await getEntriesByRecordId(recordid)
      const result= await response.json()
      return result.data;
}

export async function createEntryAction(newEntrie,record){
  let invalidEntries;
  const {identifier,type} = record;
  const responseEntries = await getEntriesByRecordId(newEntrie.record);
  const entries = await responseEntries.json()

    invalidEntries = entries.data.some((entrie) => {
      return identifier.every((field) => {
          return entrie.values[field] === newEntrie.values[field];
                });
          });
    if(invalidEntries){  
          return {msg : 'La entrada ya existe',status:400};
    }
    else{
        const response = await createEntry(newEntrie);
        const {entrie} = await response.json();
        revalidatePath(`/RecordList/${record._id}`)
        return entrie;   
    }
}

export async function getEntriesByRecordAction(recordId){
  
  const response = await getEntriesByRecord(recordId);
  const data = await response.json()
  const jsonEntries = JSON.parse(JSON.stringify(data.entries));
  return jsonEntries;
}

export async function executeAction(actions,values){

  try {
        const executedActions = await Promise.all(actions.map(async(action) =>{
          try {
                const {recordField, writeOnRecord , writeOnField,quantityType,quantityField,quantityNumber,createdBy} = action;      
                const response= await getRecordById(writeOnRecord);              
                const {record} = await response.json();

                if(record){
                          const {own,periodicity,type} = record;
                          let nuevaDueDate;
                          let fechaActual;            
                          if(type === 'PERIODIC'){
                              fechaActual = new Date(values.Fecha);
                              fechaActual.setDate(fechaActual.getDate() + periodicity);
                              
                              nuevaDueDate = fechaActual.toISOString().slice(0, 10); 
                          }
                          
                          if(type ==='NOT PERIODIC WITH REVISION'){
                            nuevaDueDate = values.vencimiento;
                          }

                          if(type === 'NOT PERIODIC'){
                            nuevaDueDate=values.fecha
                          }

                          const fields = Object.keys(own);
                          let newValues = {}
          
                          for (const field of fields) {
                            if (field === writeOnField) {
                              newValues[field] = values[recordField];
                            } else if(field === 'fecha'){
                              newValues[field] = values.fecha;
                            }else{
                              newValues[field] = "";
                            }
                          }
                                 
                          const entrieAction ={
                            record : action.writeOnRecord,      
                            dueDate : nuevaDueDate,
                            createdBy:createdBy,
                            values: newValues,
                        }          
                        const response = await createEntry(entrieAction)
                        const {entrie} = await response.json();        
                        return { success: true, result: entrie, error: "" };
                }            
          } catch (error) {
            return { success: false, result: "", error: error.message };
          }
        })); 
        return executedActions;
    
    } catch (error) {
        throw error; // 
      }
}

export async function createNextEntrie(data,identifier,periodicity,type){
  
  const {values,createdBy,dueDate,record} = data;
  let nuevaDueDate;
  let fechaActual;

  if(type === 'PERIODIC'){
      const valuesDate = new Date(values.Fecha);
      const entryDueDate = new Date(dueDate);
      const timeDiff = entryDueDate.getTime() - valuesDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff >= 0) {
        fechaActual = valuesDate;
      } else {
        fechaActual = entryDueDate;
      }
      
      fechaActual.setDate(fechaActual.getDate() + periodicity);
     
      nuevaDueDate = fechaActual.toISOString().slice(0, 10); 
  }

    if(type ==='NOT PERIODIC WITH REVISION'){
      nuevaDueDate = values.vencimiento;
    }
    const newValues = {};
    Object.entries(values).map(([key,value])=>{
        if(typeof value === 'object'){

          let subObject={};
          Object.entries(value).map(([subkey,subvalue])=>{
              subObject[subkey]=identifier.includes(`${key}.${subkey}`) ? subvalue: '';
          })
          newValues[key]=subObject;
        }else{
          newValues[key] = identifier.includes(key) ? values[key] : "";
        }
    })

    const newEntrie ={
      record ,      
      dueDate : nuevaDueDate,
      createdBy,
      values : newValues
    }
    const response = await createEntry(newEntrie);
    const {entrie} = await response.json();
    revalidatePath(`/RecordList/${record}`)
    revalidatePath(`/entrie/${entrie._id}`)
    return entrie;
}

export async function changeNextField(id){
    const response = await updateNextField(id);
    const {message,status} = await response.json();
    return ({state : status})
}

export async function getEntryAction(id){
    const response = await getEntry(id);
    const data = await response.json()
    return data.data;
}

export async function completeEntrieAction(entriId,completedEntrie,action,email){
  
  const response = await complete(entriId,completedEntrie,action,email)
  const {entrie} = await response.json();
  revalidatePath(`/entrie/${entrie._id}`)
  revalidatePath(`/RecordList/${entrie.record}`)
  return entrie;
}

export async function inactiveEntrieAction(id,comment,recordID){

  const response = await inactivateEntry(id,comment,recordID)
  revalidatePath(`/RecordList/${recordID}`)
  const rta = await response.json();
  return rta;
}

export async function getEntriesByUserAction(userid){
  const response = await getEntriesByUser(userid);
  const {entries} = await response.json()
  const currentDate = new Date();
  
  const filteredEntries = entries.filter(entry => {
    const dueDate = new Date(entry.dueDate);
    const notifyDays = entry.record.notify;
    const notifyDate = new Date(dueDate.getTime() - notifyDays * 24 * 60 * 60 * 1000);
    
    return currentDate >= notifyDate;
  });
 
  let newEntries = [];
  for (const entry of filteredEntries) {
    const daysDiff = DaysDifCurrentDate(entry.dueDate);
    if (daysDiff < 0 && !entry.nextCreated) {
        try {
            const newEntry = await createNextEntrie(entry, entry.record.identifier, entry.record.periodicity, entry.record.type);
            if (newEntry && newEntry._id) {
                const { state } = await changeNextField(entry._id);
                if (state === 200){ entry.nextCreated=true}
                newEntries.push({
                    newEntry: newEntry._id,
                    response: state
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
  }
  revalidatePath('/inicio')
  return {entries:filteredEntries,newEntries}; 

}

export async function getEntriesByOrganizationAdminAction(organizationid){
  const response = await getEntriesByOrganizationAdmin(organizationid)
  const data = await response.json();
  const entries = data.entries;

  // Paso 1: Contar entradas vencidas
  const expiredEntriesCount = countExpiredEntries(entries);

  // Paso 2: Agrupar entradas por "record.name"
  const groupedEntries = groupEntriesByRecordNameAndStatus(entries);

    
  return{ data,vencidas:expiredEntriesCount,agrupadas:groupedEntries};
}

// Función para determinar si una entrada está vencida
const isExpired = (dueDate) => {
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  return dueDateObj < today;
};

// Contar cuántas entradas están vencidas
const countExpiredEntries = (entries) => {
  return entries.filter(entry => isExpired(entry.dueDate)).length;
};

// Agrupar las entradas por "record.name" y subdividirlas por vencidas o por vencer
const groupEntriesByRecordNameAndStatus = (entries) => {
  return entries.reduce((acc, entry) => {
    const recordName = entry.record.name;
    const entryRecordId=entry.record._id
    const entryCollaborators=entry.record.collaborators
    
    // Inicializamos el grupo si no existe
    if (!acc[recordName]) {
      acc[recordName] = {
        vencidas: [],
        porVencer: [],
        recordid:entryRecordId,
        collaborators:entryCollaborators
      };
    }
    
    // Verificamos si la entrada está vencida o por vencer y la añadimos al grupo correspondiente
    if (isExpired(entry.dueDate)) {
      acc[recordName].vencidas.push(entry);
    } else {
      acc[recordName].porVencer.push(entry);
    }
    
    return acc;
  }, {});
};


////////////////////////////////////
//////////ALLOWEDUSERS//////////////
///////////////////////////////////
export async function getAllowedUsersAction(organizationid){
  const response = await getAllowedUsers(organizationid);
  const {userList}= await response.json()
  return convertToPlainObject(userList)
}

export async function changeUserStatusAction(organizationid,userid){
    const response = await changeUserStatus(userid)
    const data = await response.json()
    revalidatePath(`/organization/${organizationid}`)
    return data;
}

export async function createUserAction(newUser){
    const response=await createUser(newUser);
    const data=await response.json();
    const organizationid=newUser.organization
    revalidatePath(`/organization/${organizationid}`)
    return data;
}


////////////////////////////////////
/////////////USERS /////////////////
///////////////////////////////////

export async function getImgByUserEmailAction(userEmail){
    const user=await getImageByUserEmail(userEmail)

    return user.image
}

////////////////////////////////////
//////////////Organization//////////
///////////////////////////////////

export async function getOrganizationAction(organizationid){
   const response = await getOrganization(organizationid)
   const organization = await response.json()
   return organization;
}

export async function getRolesAction(organizationid){
  try {
    const response = await getRoles(organizationid)
    return response.json();
  } catch (error) {
     return { msg: error.message };
  }
}

export async function getOrganizationAreasAction(organizationid){
  try {
    const response = await getAreas(organizationid);
    const areas = await response.json();
    return areas;   
} catch (error) {
  return { msg: 'Error fetching organization areas' };
}
}

export async function addAreaAction(organizationid,newArea){
  const response=await addArea(organizationid,newArea)
  const data= await response.json()
  revalidatePath(`/organization/${organizationid}`)
  return data;
}

export async function deleteAreaAction(organizationid,areaid){
  const response=await deleteArea(organizationid,areaid)
  const data= await response.json()
  revalidatePath(`/organization/${organizationid}`)
  return data;
}

export async function addQaAction(organizationid,newQa){
  const response=await addQA(organizationid,newQa)
  const data= await response.json()
  revalidatePath(`/organization/${organizationid}`)
  return data;
}

export async function deleteQaAction(organizationid,qaid){
  const response=await deleteQA(organizationid,qaid)
  const data= await response.json()
  revalidatePath(`/organization/${organizationid}`)
  return data;
}

////////////////////////////////////
//////////////DOCUMENTS   //////////
///////////////////////////////////

export async function submitDocumentAction (document,action){

  try {
    if(action==='create'){
          const response = await getDocumentByName(document.name)
          const data = await response.json()
        
          if(data?.document?._id){
            return {msg : 'Document name already exist',status:409}
          } else if(data.status === 404){
      
            const {id} = await createDocument(document);
            revalidatePath('/document')
            return {id:id,status:200,msg:'Document created succesfully'};
          }
    }

    if(action==='newVersion'){
        const {id} = await createDocument(document);
        return {id:id,status:200,msg:'Document created succesfully'};
    }
  } catch (error) {
    return { msg: 'Error fetching document' };
  }
}

export async function getDocumentsAction(organizationid){
  const response = await getDocuments(organizationid);
  const data= await response.json()
  return data;
}

export async function getDocumentsByUserAction(userEmail, userRole, organizationid) {
    const response = await getDocumentsByUser(userEmail, userRole, organizationid);
    const data = await response.json()
    return data;
  
}

export async function getDocumentsNotPublishedByUserAction(userEmail, userRole, organizationid) {
    const response = await getDocumentsNotPublishedByUser(userEmail, userRole, organizationid);
    const data=await response.json()
    return data;
}

export async function getDocumentsObsoleteByUserAction(userEmail, userRole, organizationid) {
    const response = await getDocumentsObsoleteByUser(userEmail, userRole, organizationid); 
    const data=await response.json()  
    return data;
}


export async function getDocumentsByUser2Action(userEmail, userRole, organizationid,query,page,limit) {
  try {
    const documents = await getDocumentsByUser2(userEmail, userRole, organizationid,query,page,limit);
    return documents.documents;
  } catch (error) {
    return NextResponse.json({ msg: error.message || 'Error en el servidor', status: 500 }); // Manejar el error aquí
  }
}

export async function getDocumentsNotPublishedByUserAction2(userEmail, userRole, organizationid,query,page,limit) {
  try {
    const documents = await getDocumentsNotPublishedByUser2(userEmail, userRole, organizationid,query,page,limit);
    return documents.documents;
  } catch (error) {
    return NextResponse.json({ msg: error.message || 'Error en el servidor', status: 500 }); // Manejar el error aquí
  }
}

export async function getDocumentsObsoleteByUserAction2(userEmail, userRole, organizationid,query,page,limit) {
  try {
    const documents = await getDocumentsObsoleteByUser2(userEmail, userRole, organizationid,query,page,limit);
    return documents.documents;
  } catch (error) {
    return NextResponse.json({ msg: error.message || 'Error en el servidor', status: 500 }); // Manejar el error aquí
  }
}

export async function getDocumentByIdAction(documentid){
      const response = await getDocumentById(documentid)
      const data = await response.json()
      return data;
}

export async function setDocumentAccessAction(documentid,newList){
    const response=await setDocumentAccess(documentid,newList)
    const data=await response.json()
    revalidatePath(`document/${documentid}`)
    return data;
}

export async function deleteDocumentAccessAction(documentid,roleid){
    const response=await deleteDocumentAccess(documentid,roleid)
    const data=await response.json()
    revalidatePath(`document/${documentid}`)
    return data;
}


export async function addParagraphAction(newPara,documentid){
  try {
    const response = await addParagraph(newPara,documentid)
    if(response.status === 200){
      revalidatePath(`/document/${documentid}`)
    }
    return response;
  } catch (error) {
    return { msg: 'Error fetching document' };
  }
}

export async function editParagraphAction(paragraph,idDoc,idParagraph){
    const response = await editParagraph(paragraph,idDoc,idParagraph);
    revalidatePath(`/document/${idDoc}`)
    return response;
}

export async function deleteParagraphAction(idDocument,idParagraph){
   const response = await deleteParagraph(idDocument,idParagraph);
   const data = await response.json();
   console.log(data)
   revalidatePath(`/document/${idDocument}`)
   return data;   
}

export async function addFunctionalPdfAction(idDocument,pdfBase64){
    const response = await addFunctionalPdf(idDocument,pdfBase64);
    const result = await response.json()
    revalidatePath(`/document/${idDocument}`)
    return result;
}

export async function changeStatusAction(documentid,newstatus){
  try {
    const response = await changeStatus(documentid,newstatus);
    const data = await response.json();
    revalidatePath(`/document/${documentid}`)
    return data;   
  } catch (error) {
    return { msg: 'Error fetching document' };
  }
}

export async function getDocumentToReviewAction(organizationid){
    const response = await getDocumentToReview(organizationid)
    const data = await response.json()
    return data;
}


////////////////////////////////////
//////////////HISTORY///////////////
///////////////////////////////////


export async function createHistoryAction(userid, newaction, newcomment, documentid){
  const response=await createHistory(userid, newaction, newcomment, documentid)
  const data = await response.json()
  revalidatePath(`/document/${documentid}`)
  return data;
}

export async function getHistoryByDocumentIdAction(documentid){
  const response=await getHistoryByDocumentId(documentid)
  const data=await response.json()
  revalidatePath(`/document/${documentid}`)
  return data;
}