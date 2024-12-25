import { NextResponse } from 'next/server'
import IngresoMateriaPrima from '@/models/IngresoMateriaPrima'
import connectToDB from '@/config/connectToDB'
import mongoose from 'mongoose'

export async function createIngresoMateriaPrima(newIngresoMateriaPrima) {
  try {
    await connectToDB()
    const ingresoMateriaPrima = new IngresoMateriaPrima(newIngresoMateriaPrima)
    const savedIngresoMateriaPrima = await ingresoMateriaPrima.save()
    return NextResponse.json({ status: 201, ingresoMateriaPrima: savedIngresoMateriaPrima })
  } catch (error) {
    console.error('Error al crear ingreso de materia prima:', error)
    return NextResponse.json({ status: 500, message: 'Error al crear ingreso de materia prima.' })
  }
}

export async function getIngresosMateriaPrima(organizationId) {
  try {
    await connectToDB()
    const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId)
    return await IngresoMateriaPrima.find({ organization: organizationIdObjectId }).populate('materiaPrima')
  } catch (error) {
    console.error('Error en getIngresosMateriaPrima:', error)
    throw error // Propagamos el error para manejarlo en la acción del servidor
  }
}

export async function getIngresosMateriaPrimaPagination(organizationId, query = '', page, limit) {
  try {
    await connectToDB()
    
    const organizationIdObjectId = new mongoose.Types.ObjectId(organizationId)
    const skip = (page - 1) * limit

    const pipeline = [
      { $match: { organization: organizationIdObjectId } },
      {
        $lookup: {
          from: 'materiaprimas',
          localField: 'materiaPrima',
          foreignField: '_id',
          as: 'materiaPrimaInfo'
        }
      },
      { $unwind: '$materiaPrimaInfo' },
      { $skip: skip },
      { $limit: limit }
    ]

    if (query.trim() !== "") {
      pipeline.unshift({ 
        $search: { 
          index: "ingresoMateriaPrimaSearch",
          compound: {
            should: [
              {
                autocomplete: { 
                  query: query, 
                  path: "lote" 
                }
              },
              {
                autocomplete: { 
                  query: query, 
                  path: "materiaPrimaInfo.nombre" 
                }
              }
            ]
          }
        } 
      })
    }

    pipeline.push({
      $project: {
        _id: { $toString: '$_id' },
        lote: 1,
        cantidad: 1,
        unidad: 1,
        fechaIngreso: { $dateToString: { format: "%Y-%m-%d", date: "$fechaIngreso" } },
        materiaPrima: {
          _id: { $toString: '$materiaPrimaInfo._id' },
          nombre: '$materiaPrimaInfo.nombre',
          codigo: '$materiaPrimaInfo.codigo',
          codigoInterno: '$materiaPrimaInfo.codigoInterno'
        },
        createdAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } },
        updatedAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$updatedAt" } }
      }
    })

    const ingresosMateriaPrima = await IngresoMateriaPrima.aggregate(pipeline)

    // Obtener el total de documentos para la paginación
    const totalDocs = await IngresoMateriaPrima.countDocuments({ organization: organizationIdObjectId })

    return { 
      status: 200, 
      ingresosMateriaPrima,
      totalDocs,
      page,
      totalPages: Math.ceil(totalDocs / limit)
    }
  } catch (error) {
    console.error('Error al obtener ingresos de materias primas:', error)
    return { 
      status: 500, 
      message: 'Error al obtener ingresos de materias primas.',
      ingresosMateriaPrima: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0
    }
  }
}



export async function updateIngresoMateriaPrima(id, updateData) {
  try {
    await connectToDB()
    const updatedIngresoMateriaPrima = await IngresoMateriaPrima.findByIdAndUpdate(id, updateData, { new: true })
    if (!updatedIngresoMateriaPrima) {
      return NextResponse.json({ status: 404, message: 'Ingreso de materia prima no encontrado.' })
    }
    return NextResponse.json({ status: 200, ingresoMateriaPrima: updatedIngresoMateriaPrima })
  } catch (error) {
    console.error('Error al actualizar ingreso de materia prima:', error)
    return NextResponse.json({ status: 500, message: 'Error al actualizar ingreso de materia prima.' })
  }
}

export async function deleteIngresoMateriaPrima(id) {
  try {
    await connectToDB()
    const deletedIngresoMateriaPrima = await IngresoMateriaPrima.findByIdAndDelete(id)
    if (!deletedIngresoMateriaPrima) {
      return NextResponse.json({ status: 404, message: 'Ingreso de materia prima no encontrado.' })
    }
    return NextResponse.json({ status: 200, message: 'Ingreso de materia prima eliminado con éxito.' })
  } catch (error) {
    console.error('Error al eliminar ingreso de materia prima:', error)
    return NextResponse.json({ status: 500, message: 'Error al eliminar ingreso de materia prima.' })
  }
}

