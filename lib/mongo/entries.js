import { NextResponse } from 'next/server'
import Entrie from '@/models/entrie'
import connectToDB from '@/config/connectToDB'
import Record from '@/models/record';


export async function getEntriesByRecordId(recordid) {
    console.log(recordid)
    try {
        await connectToDB();
        const entries = await Entrie.find({ record: recordid })
                                    .sort({ dueDate: -1 })
                                    .populate('record')
                                    .exec();

        if (!entries) throw new Error();
        return new NextResponse(JSON.stringify({ status: 200, data: entries }), { status: 200 }); // Use new to instantiate
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ status: 404, message: 'Error al buscar entradas.' }), { status: 404 }); // Use new to instantiate
    }
}


export async function createEntry(newEntry){
    try {
        await connectToDB()
        const entrie = new Entrie(newEntry);
        const entrieSaved = await entrie.save();  
       return NextResponse.json({status:200,entrie:entrieSaved})   
    } catch (error) {
        console.log(error);
        return new NextResponse.json({ status: 404, message: 'Error al crear entrada.' }); // Use new to instantiate
    }
}

export async function updateNextField(id){
    try {
        await connectToDB();
        const entrie = await Entrie.findById(id);
        entrie.nextCreated = true;
        entrie.save();
        return NextResponse.json({ message: 'Your entrie has been update successfully.',status: 200 }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
 }

 export async function getEntriesByRecord(recordID){
    try {
        await connectToDB();
        const entriesMongo = await Entrie.find({record:recordID,isActive: true})
        .sort({ dueDate: -1 }) // Ordena por dueDate en orden descendente (-1)
        .exec();
       if (!entriesMongo) throw new Error();
       return NextResponse.json({ entries: entriesMongo,status:200})
        
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor',status:500 });
    }
}

export async function getEntry(id) {
    try {
        await connectToDB();
        const entrie = await Entrie.findById(id).populate('record')
        if (!entrie) throw new Error();
        return new NextResponse(JSON.stringify({ status: 200, data: entrie }), { status: 200 }); // Use new to instantiate
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ status: 404, message: 'Error al buscar entradas.' }), { status: 404 }); // Use new to instantiate
    }
}

export async function complete(entrieId,completedEntrie,action,email){

    try {
        await connectToDB();
        const entrie = await Entrie.findById(entrieId);
        entrie.values = completedEntrie;
        entrie.completedBy=email;
        if(action ==='completar'){entrie.completed=true};
        const entrieSaved = await entrie.save();
        return NextResponse.json({entrie:entrieSaved,status:202})
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor',status:500 });
    }
}

export async function inactivateEntry(id,comment,recordid){

    try {
        await connectToDB();
           const entrie = await Entrie.findById(id).populate('record');
           const identifiers = entrie.record.identifier
           const values = entrie.values
       
           const valueIdentifiers = identifiers.map((identifier)=>{
                   return values[identifier];
           })
          const response = await getEntriesByRecord(recordid)
           const data = await response.json()
          const filteredEntries = data.entries.filter((entry) => {
           return identifiers.every((identifier, index) => {
               return entry.values[identifier] === valueIdentifiers[index];      
               });
           });

         const updateList = filteredEntries.map((entry)=>{
                   entry.isActive = false;
                   entry.comment = comment;
                   return entry
         })

         // Aquí guardamos las entradas actualizadas en la base de datos
           for (const updatedEntry of updateList) {
               await Entrie.updateOne({ _id: updatedEntry._id }, {
               isActive: updatedEntry.isActive,
               comment: updatedEntry.comment,
               });
           }
           return NextResponse.json({ message: 'Entrada archivada',status: 200 }, { status: 200 });
          
   } catch (error) {
       return NextResponse.json({ msg: 'Error en el servidor' });
   }
}

export async function getEntriesByUser(userid){
    try {
        await connectToDB();
        const records = await Record.find(
            {
                $or: [
                    { createdBy: userid },
                    { collaborators: userid },
                ],
            },
        )
        
        const recordIds = records.map(record => record._id);
        
        const filteredEntries = await Entrie.find({
            completed: false,
            record: { $in: recordIds },
        }).populate({
            path: 'record',
            select: 'notify identifier periodicity type name',
        });
        
        return NextResponse.json({ entries: filteredEntries });

    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' });
    }
}

export async function getEntriesByOrganizationAdmin(organizationid){
    try {
        await connectToDB();
        const entriesMongo = await Entrie.find({organization:organizationid,completed: false}).populate({
                                                                                                path: 'record', // El campo a popular
                                                                                                select: 'name collaborators createdBy',
                                                                                                populate: { 
                                                                                                    path: 'collaborators',
                                                                                                    select: 'email' 
                                                                                                }
                                                                                            });
       if (!entriesMongo) throw new Error();
       return NextResponse.json({ entries: entriesMongo,status:200})
        
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor',status:500 });
    }
}


/*export async function importEntrys(recordid, newrecordid, newownkeys) {
    try {
      await connectToDB();
  
      // Find all entries for the old record
      const oldEntries = await Entrie.find({ record: recordid });
  
      // Create new entries based on the old ones
      const newEntries = oldEntries.map(oldEntry => {
        // Filter values to keep only the keys in newownkeys
        const filteredValues = Object.fromEntries(
          Object.entries(oldEntry.values).filter(([key]) => newownkeys.includes(key))
        );
  
        return {
          record: newrecordid,
          dueDate: oldEntry.dueDate,
          nextCreated: oldEntry.nextCreated, // Reset to false for the new entry
          completedBy: oldEntry.completedBy,
          completed: oldEntry.completed,
          pdf: oldEntry.pdf,
          createdBy: oldEntry.createdBy,
          values: filteredValues,
          isActive: oldEntry.isActive,
          comment: oldEntry.comment,
          organization: oldEntry.organization,
        };
      });
  
      // Insert all new entries
      if (newEntries.length > 0) {
        await Entrie.insertMany(newEntries);
      }
  
      return NextResponse.json({ 
        message: `Se importaron ${newEntries.length} entradas`, 
        status: 200,
        count: newEntries.length
      });
  
    } catch (error) {
      console.error('Error importando entradas:', error);
      return NextResponse.json({ message: 'Error en el servidor', status: 500 });
    }
  }*/


    export async function importEntrys(recordid, newrecordid, fieldMappings) {
        try {
            await connectToDB();
    
            // Find all entries for the old record
            const oldEntries = await Entrie.find({ record: recordid });
    
            // Create new entries based on the old ones
            const newEntries = oldEntries.map(oldEntry => {
                // Map values using fieldMappings
                const mappedValues = {};
                Object.keys(fieldMappings).forEach(newField => {
                    const oldField = fieldMappings[newField];
                    if (oldField && oldEntry.values.hasOwnProperty(oldField)) {
                        mappedValues[newField] = oldEntry.values[oldField];
                    } else {
                        // Set empty value for new fields or fields without mapping
                        mappedValues[newField] = "";
                    }
                });
    
                return {
                    record: newrecordid,
                    dueDate: oldEntry.dueDate,
                    nextCreated: true, // Reset to false for the new entry
                    completedBy: oldEntry.completedBy,
                    completed: oldEntry.completed,
                    pdf: oldEntry.pdf,
                    createdBy: oldEntry.createdBy,
                    values: mappedValues,
                    isActive: oldEntry.isActive,
                    comment: oldEntry.comment,
                    organization: oldEntry.organization,
                };
            });
    
            // Insert all new entries
            if (newEntries.length > 0) {
                await Entrie.insertMany(newEntries);
            }
    
            return NextResponse.json({ 
                message: `Se importaron ${newEntries.length} entradas`, 
                status: 200,
                count: newEntries.length
            });
    
        } catch (error) {
            console.error('Error importando entradas:', error);
            return NextResponse.json({ message: 'Error en el servidor', status: 500 });
        }
    }