import connectToDB from "@/config/connectToDB"
import { NextResponse } from "next/server"
import Organization from "@/models/organization"

export async function getOrganization(organizationid) {
    try {
            await connectToDB();
            const organization = await Organization.findById(organizationid)
                                                    .populate('roles')
                                                    .populate({
                                                            path: 'areas',
                                                            populate: { 
                                                                     path: 'collaborators', 
                                                                     select: 'email' 
                                                             }})
                                                    .populate({ // Populate qualityAssurance.user con email y fullName
                                                            path: 'qualityAssurance',
                                                            populate: {
                                                            path: 'user',
                                                            select: 'email fullName'
                                                            }
                                                    });
            if(!organization){
                NextResponse.json ({ msg: 'No se encontró organización', status: 404 });
            }
            return NextResponse.json( { msg: 'Organizacion encontrada', status: 200, data:organization });     
    } catch (error) {
            return NextResponse.json({ msg: 'Error en el servidor', status: 500 });
          }
  }


  export async function getRoles(organizationid){
    
    try {
        await connectToDB();
        const organization = await Organization.findById(organizationid).populate('roles');     
        if(!organization){
            NextResponse.json ({ msg: 'No se encontró organización', status: 404 });
        }
        return NextResponse.json( { msg: 'Roles encontrados', status: 200, roles:organization.roles });     
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor', status: 500 });
    }
}

export async function getAreas(organizationid){
    try {
        await connectToDB();
        const organization = await Organization.findById(organizationid).select('areas');
        
        if(!organization){
            return { msg: 'No se encontró organización', status: 404 };
        }
        return NextResponse.json({ organization:organization,status:200 });
        
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function addArea(organizationid,newArea){
    try {
        await connectToDB();
        const organization=await Organization.findById(organizationid)
        if(!organization){
            return NextResponse.json({ msg: 'No se encontró organización', status: 404 });
        }
        const areaExists = organization.areas.some(area => area.name.toLowerCase() === newArea.name.toLowerCase());
        if(areaExists){
            return NextResponse.json({ msg: 'El Area ya existe.', status: 400 });
        }
        organization.areas.push(newArea)
        await organization.save()
        return NextResponse.json({msg:'Area agregada.',status:200})
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function deleteArea(organizationid,areaid){
    try {
        await connectToDB();
        const organization=await Organization.findById(organizationid)
        if(!organization){
            return NextResponse.json({ msg: 'No se encontró organización', status: 404 });
        }
        organization.areas = organization.areas.filter(area => area._id.toString() !== areaid); 
        await organization.save();
        return NextResponse.json({ msg: 'Área eliminada correctamente', status: 200 });
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}

export async function addQA(organizationid,newQa){
    try {
        await connectToDB();
        const organization=await Organization.findById(organizationid)
        if(!organization){
            return NextResponse.json({ msg: 'No se encontró organización', status: 404 });
        }
        organization.qualityAssurance.push(newQa)
        await organization.save()
        return NextResponse.json({msg:'Gestor de calidad agregado.',status:200})
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}


export async function deleteQA(organizationid,qaid){
    try {
        await connectToDB();
        const organization=await Organization.findById(organizationid)
        if(!organization){
            return NextResponse.json({ msg: 'No se encontró organización', status: 404 });
        }
        organization.qualityAssurance = organization.qualityAssurance.filter(qa => qa._id.toString() !== qaid); 
        await organization.save();
        return NextResponse.json({msg:'Gestor eliminado correctamente.',status:200})
    } catch (error) {
        return NextResponse.json({ msg: 'Error en el servidor' ,status : 500});
    }
}