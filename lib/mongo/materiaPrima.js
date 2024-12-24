import { NextResponse } from 'next/server'
import MateriaPrima from '@/models/MateriaPrima'
import connectToDB from '@/config/connectToDB'
import mongoose from 'mongoose'

export async function createMateriaPrima(newMateriaPrima) {
  try {
    await connectToDB()
    const materiaPrima = new MateriaPrima(newMateriaPrima)
    const savedMateriaPrima = await materiaPrima.save()
    return NextResponse.json({ status: 201, materiaPrima: savedMateriaPrima })
  } catch (error) {
    console.error('Error al crear materia prima:', error)
    return NextResponse.json({ status: 500, message: 'Error al crear materia prima.' })
  }
}

/*export async function getMateriaPrimas(organizationId) {
  try {
    await connectToDB()
    const materiasPrimas = await MateriaPrima.find({ organization: organizationId })
    return NextResponse.json({ status: 200, materiasPrimas })
  } catch (error) {
    console.error('Error al obtener materias primas:', error)
    return NextResponse.json({ status: 500, message: 'Error al obtener materias primas.' })
  }
}*/

export async function getMateriaPrimas(organizationId) {
    try {
      await connectToDB()
      const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId)
      return await MateriaPrima.find({ organization: organizationIdObjectId })
    } catch (error) {
      console.error('Error en getMateriaPrimas:', error)
      throw error // Propagamos el error para manejarlo en la acción del servidor
    }
  }
  

  export async function getMateriaPrimasByOrganizationPagination(organizationId, query = '', page, limit) {
    try {
      await connectToDB()
      
      const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId)
      const skip = (page - 1) * limit
  
      const pipeline = [
        { $match: { organization: organizationIdObjectId } },
        { $skip: skip },
        { $limit: limit }
      ]
  
      if (query.trim() !== "") {
        pipeline.unshift({ 
          $search: { 
            index: "materiaPrimaSearch", // Asegúrate de que este índice exista en tu base de datos
            compound: {
              should: [
                {
                  autocomplete: { 
                    query: query, 
                    path: "nombre" 
                  }
                },
                {
                  autocomplete: { 
                    query: query, 
                    path: "codigo" 
                  }
                },
                {
                  autocomplete: { 
                    query: query, 
                    path: "sinonimos" 
                  }
                }
              ]
            }
          } 
        })
      }
  
      pipeline.push({
        $project: {
          _id: 1,
          codigo: 1,
          nombre: 1,
          sinonimos: 1,
          codigoInterno: 1,
          organization: 1,
          createdAt: 1,
          updatedAt: 1
        }
      })
  
      const materiasPrimas = await MateriaPrima.aggregate(pipeline)
  
      // Obtener el total de documentos para la paginación
      const totalDocs = await MateriaPrima.countDocuments({ organization: organizationIdObjectId })
  
      return { 
        status: 200, 
        materiasPrimas: materiasPrimas.map(mp => ({ ...mp, _id: mp._id.toString() })),
        totalDocs,
        page,
        totalPages: Math.ceil(totalDocs / limit)
      }
    } catch (error) {
      console.error('Error al obtener materias primas:', error)
      return { 
        status: 500, 
        message: 'Error al obtener materias primas.',
        materiasPrimas: [],
        totalDocs: 0,
        page: 1,
        totalPages: 0
      }
    }
  }

export async function updateMateriaPrima(id, updateData) {
  try {
    await connectToDB()
    const updatedMateriaPrima = await MateriaPrima.findByIdAndUpdate(id, updateData, { new: true })
    if (!updatedMateriaPrima) {
      return NextResponse.json({ status: 404, message: 'Materia prima no encontrada.' })
    }
    return NextResponse.json({ status: 200, materiaPrima: updatedMateriaPrima })
  } catch (error) {
    console.error('Error al actualizar materia prima:', error)
    return NextResponse.json({ status: 500, message: 'Error al actualizar materia prima.' })
  }
}

export async function deleteMateriaPrima(id) {
  try {
    await connectToDB()
    const deletedMateriaPrima = await MateriaPrima.findByIdAndDelete(id)
    if (!deletedMateriaPrima) {
      return NextResponse.json({ status: 404, message: 'Materia prima no encontrada.' })
    }
    return NextResponse.json({ status: 200, message: 'Materia prima eliminada con éxito.' })
  } catch (error) {
    console.error('Error al eliminar materia prima:', error)
    return NextResponse.json({ status: 500, message: 'Error al eliminar materia prima.' })
  }
}

