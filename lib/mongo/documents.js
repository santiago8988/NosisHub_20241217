import connectToDB from "@/config/connectToDB"
import { NextResponse } from "next/server"
import Document from "@/models/document"
import mongoose,{PipelineStage} from "mongoose";


export async function getDocumentByName(searchName){
    try {
        await connectToDB();
        const document = await Document.findOne({name:searchName})
        if (document) {
            // Document with the specified name was found
            return NextResponse.json({ document });
        } else {
            // Document with the specified name was not found
            return NextResponse.json({ msg: 'Document not found', status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}


export async function createDocument(newDocument){

    try {
        await connectToDB()
        const document = new Document(newDocument);
        const documentSaved = await document.save();
        if(documentSaved && documentSaved.version !==1){
            const searchVersion = documentSaved.version -1
            const oldDocument = await getDocumentByNameAndVersion(documentSaved.name,searchVersion)
            if (oldDocument) {
                oldDocument.revisionCreated = true;
                await oldDocument.save();
            }
        }
        return {id: documentSaved._id.toString()}
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function getDocuments(organizationid){

    try {
        await connectToDB();
        const documents = await Document.find({organization:organizationid}).populate('organization')
        if(!documents){
            return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 500});
        }
        return NextResponse.json({ documents: documents ,status : 200});
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }

}

export async function getDocumentToReview(organizationid){

  try {
      await connectToDB();
      const documents = await Document.find({organization:organizationid,status:'published'}).populate('organization')
      if(!documents){
          return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 500});
      }
      return NextResponse.json({ documents: documents ,status : 200});
  } catch (error) {
      return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
  }

}

export async function getDocumentsByUser(userEmail,userRole,organizationid){
    try {
        await connectToDB();
        const query = {
            organization: organizationid,
            status: 'published',
            $or: [
              { createdBy: userEmail },
              {
                access: {
                  $elemMatch: {
                    "role.name": userRole,
                    permissionLevel: { $in: ["read", "write", "admin"] },
                  },
                },
              },
            ],
          };
          const documents = await Document.find(query).populate('organization');
          if (!documents || documents.length === 0) {
            return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 404,docs:[]});
          }
          return NextResponse.json({ msg: 'Documento encontrados' ,status : 200, docs:documents});
        } catch (error) {
          throw error; // Lanzar el error para que sea capturado en _actions.js
        }
}

export async function getDocumentsNotPublishedByUser(userEmail,userRole,organizationid){
  try {
      await connectToDB();
      const query = {
          organization: organizationid,
          status: { $nin: ['published', 'obsolete'] },
          $or: [
            { createdBy: userEmail },
            {
              access: {
                $elemMatch: {
                  "role.name": userRole,
                  permissionLevel: { $in: ["read", "write", "admin"] },
                },
              },
            },
          ],
        };
        const documents = await Document.find(query).populate('organization');
        if (!documents || documents.length === 0) {
          return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 404,docs:[]});
        }
        return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 404,docs:documents});
      } catch (error) {
        throw error; // Lanzar el error para que sea capturado en _actions.js
      }
}

export async function getDocumentsObsoleteByUser(userEmail,userRole,organizationid){
  try {
      await connectToDB();
      const query = {
          organization: organizationid,
          status: { $in: ['obsolete'] },
          $or: [
            { createdBy: userEmail },
            {
              access: {
                $elemMatch: {
                  "role.name": userRole,
                  permissionLevel: { $in: ["read", "write", "admin"] },
                },
              },
            },
          ],
        };
        const documents = await Document.find(query).populate('organization');
        if (!documents || documents.length === 0) {
          return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 404,docs:[]});
        }
        return NextResponse.json({ msg: 'Documentos no encontrados' ,status : 404,docs:documents});
      } catch (error) {
        throw error; // Lanzar el error para que sea capturado en _actions.js
      }
}


    export async function getDocumentsByUser2(
      userEmail,
      userRole,
      organizationId,
      queryUser = "",
      page,// Añade parámetros para paginación
      limit
    ) {
      try {
        await connectToDB();
    
        const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId);
        const skip = (page - 1) * limit; // Calcula el número de documentos a saltar
    
        // Construye el pipeline de agregación
        const pipeline = [
          { $match: { organization: organizationIdObjectId, status:  'published' } },
          /*{ $match: { organization: organizationIdObjectId, status: { $ne: 'obsolete' } } },*/
          { $match: {
              $or: [
                  { createdBy: userEmail },
                  { access: { $elemMatch: { "role.name": userRole, permissionLevel: { $in: ["read", "write", "admin"] } } } }
              ]
            } 
          },
          { $skip: skip }, // Salta los documentos necesarios para la paginación
          { $limit: limit } // Limita el número de documentos a devolver
        ];
    
        if (queryUser.trim() !== "") { // Verifica que query no esté vacío o solo contenga espacios
          pipeline.unshift({$search: {index: "default", autocomplete: {query: queryUser, path: "name"}}} );
        }
        
        const documents = await Document.aggregate(pipeline);
    
        if (documents.length === 0) {
          return { error: 'Documentos no encontrados' };
        }
    
        return { documents };
      } catch (error) {
        return { error };
      }
    }

    export async function getDocumentsNotPublishedByUser2(
      userEmail,
      userRole,
      organizationId,
      queryUser = "",
      page,
      limit
    ) {
      try {
        await connectToDB();
    
        const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId);
        const skip = (page - 1) * limit;
    
        const basePipeline = [
          { 
            $match: { 
              organization: organizationIdObjectId, 
              status: { $nin: ['published', 'obsolete'] } 
            } 
          },
          { 
            $match: {
              $or: [
                { createdBy: userEmail },
                { access: { $elemMatch: { "role.name": userRole, permissionLevel: { $in: ["read", "write", "admin"] } } } }
              ]
            } 
          }
        ];
    
        // Añadir búsqueda si queryUser no está vacío
        if (queryUser.trim() !== "") {
          basePipeline.unshift({$search: {index: "default", autocomplete: {query: queryUser, path: "name"}}});
        }
    
        // Pipeline para contar documentos
        const countPipeline = [...basePipeline, { $count: "total" }];
    
        // Pipeline para obtener documentos paginados
        const documentsPipeline = [
          ...basePipeline,
          { $skip: skip },
          { $limit: limit }
        ];
    
        // Ejecutar ambos pipelines
        const [countResult, documents] = await Promise.all([
          Document.aggregate(countPipeline),
          Document.aggregate(documentsPipeline)
        ]);
    
        const total = countResult[0]?.total || 0;
    
        return { 
          documents,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        };
      } catch (error) {
        return { error };
      }
    }

  export async function getDocumentsObsoleteByUser2(userEmail,userRole,organizationId,queryUser = "",page,limit) {
    try {
      await connectToDB();
      const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId);
      const skip = (page - 1) * limit;
  
      const basePipeline = [
        { 
          $match: { 
            organization: organizationIdObjectId, 
            status: { $in: ['obsolete'] } 
          } 
        },
        { 
          $match: {
            $or: [
              { createdBy: userEmail },
              { access: { $elemMatch: { "role.name": userRole, permissionLevel: { $in: ["read", "write", "admin"] } } } }
            ]
          } 
        }
      ];
  
      // Añadir búsqueda si queryUser no está vacío
      if (queryUser.trim() !== "") {
        basePipeline.unshift({$search: {index: "default", autocomplete: {query: queryUser, path: "name"}}});
      }
  
      // Pipeline para contar documentos
      const countPipeline = [...basePipeline, { $count: "total" }];
  
      // Pipeline para obtener documentos paginados
      const documentsPipeline = [
        ...basePipeline,
        { $skip: skip },
        { $limit: limit }
      ];
  
      // Ejecutar ambos pipelines
      const [countResult, documents] = await Promise.all([
        Document.aggregate(countPipeline),
        Document.aggregate(documentsPipeline)
      ]);
  
      const total = countResult[0]?.total || 0;
  
      return { 
        documents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      return { error };
    }
  }
    
  

export async function getDocumentById(documentid){
    try {
        await connectToDB()
        const document = await Document.findOne({_id:documentid})
                                        .populate({
                                             path: 'access',
                                             populate: {
                                                    path: 'role',
                                                    model: 'Role'
                                              }
                                         });
        if(!document){
            return NextResponse.json({ msg: 'Documento no encontrados' ,status : 404});
        }
        return NextResponse.json({ document: document ,status : 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function setDocumentAccess(documentid,newList){
    try {
            await connectToDB()
            const document = await Document.findById(documentid);
            if (!document) {
                return NextResponse.json({ msg: 'Documento no encontrados' ,status : 404});
            }
            document.access = newList;
            await document.save();
            return NextResponse.json({ message:'Accesos otorgados.',status : 200});
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function deleteDocumentAccess(documentid,roleid){
    try {
        await connectToDB()
        const document = await Document.findById(documentid);
        if (!document) {
            return NextResponse.json({ msg: 'Documento no encontrados' ,status : 404});
        }
        document.access = document.access.filter(accessEntry => 
            !accessEntry.role.equals(roleid) 
          );
          await document.save();
          return NextResponse.json({ msg: 'Acceso eliminado correctamente', status: 200 });
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function addParagraph(newPara,id){
    try {
        await connectToDB();
        const documentToUpdate = await Document.findById(id);
        if (!documentToUpdate) {
            return { msg: 'Documento no encontrado', status: 404 };
        }      
        documentToUpdate.content.push(newPara);
        await documentToUpdate.save();
        return { msg: 'Párrafo agregado exitosamente', status: 200 };
    } catch (error) {
        return { msg: 'Error en el servidor' ,status : 500};
    }
}

export async function editParagraph(newParagraph,idDoc,idParagraph){

    try {
         await connectToDB();
         const documentToUpdate = await Document.findById(idDoc);
         if (!documentToUpdate) {
                return { msg: 'Documento no encontrado', status: 404 };
         }      
        // Buscar el índice del párrafo en el array content
        const updatedContent = documentToUpdate.content.map(paragraph => {
                if (paragraph._id.toString() === idParagraph) {
                        // Actualizar los valores del párrafo
                        paragraph.title = newParagraph.title;
                        paragraph.body = newParagraph.body;
                        paragraph.addedBy = newParagraph.addedBy;
                        paragraph.image = newParagraph.image
                    }
                    return paragraph; // Devuelve el párrafo actualizado o sin cambios
                });     
                documentToUpdate.content = updatedContent;
                await documentToUpdate.save();
                return { msg: 'Párrafo actualizado exitosamente', status: 200 };
    } catch (error) {
        return { msg: 'Error en el servidor' ,status : 500};
    }
}

export async function deleteParagraph(documentid,paragraphid){
    try {
        await connectToDB();
        const document = await Document.findById(documentid);
        if (!document) {
            return NextResponse.json({ msg: 'Documento no encontrado', status: 404 });
        }
        const paragraphIndex = document.content.findIndex(
          (paragraph) => paragraph._id.toString() === paragraphid
        );
        if (paragraphIndex === -1) {
          return NextResponse.json({ msg: 'Párrafo no encontrado', status: 404 });
        }
        document.content.splice(paragraphIndex, 1);
        await document.save();
        return NextResponse.json({msg: 'Párrafo eliminado y documento actualizado exitosamente', status: 200});
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function addFunctionalPdf(idDocument,pdfBase64){  
    try {
        await connectToDB();
        const documentToUpdate = await Document.findById(idDocument);
        if (!documentToUpdate) {
            return { msg: 'Documento no encontrado', status: 404 };
        }
        documentToUpdate.pdf = pdfBase64;
        await documentToUpdate.save();
        return NextResponse.json({ msg: 'PDF adjuntado correctamente', status: 200 });
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function changeStatus(id,newStatus){
    try {
        await connectToDB();
        const document = await Document.findById(id);
        if (!document) {
            return NextResponse.json({ msg: 'Documento no encontrado', status: 404 });
          }
          if(newStatus==='published'){
            document.dueDate=handleDueDate(document.revision);
            document.isActive=true;
          }
        document.status = newStatus;
        const updatedDocument = await document.save();
        return NextResponse.json({ msg: 'Documento actualizado exitosamente', status: 200, document:updatedDocument });
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
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