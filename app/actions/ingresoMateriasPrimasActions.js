'use server'

import { 
  getIngresosMateriaPrima, 
  getIngresosMateriaPrimaPagination, 
  updateIngresoMateriaPrima, 
  createIngresoMateriaPrima,
  deleteIngresoMateriaPrima
} from "@/lib/mongo/ingresoMateriaPrima"
import { revalidatePath } from "next/cache"

export async function getIngresosMateriaPrimaAction(organizationId) {
  try {
    const ingresosMateriaPrima = await getIngresosMateriaPrima(organizationId)
    console.log(ingresosMateriaPrima)
    return { 
      status: 200, 
      ingresosMateriaPrima: ingresosMateriaPrima.map(imp => ({
        ...imp.toObject(),
        _id: imp._id.toString()
      }))
    }
  } catch (error) {
    console.error('Error al obtener ingresos de materias primas:', error)
    return { status: 500, message: 'Error al obtener ingresos de materias primas.' }
  }
}

export async function getIngresosMateriaPrimaPaginationAction(organizationId, query = '', page = 1, limit = 10) {
  const result = await getIngresosMateriaPrimaPagination(organizationId, query, page, limit)
  return result
}

export async function createIngresoMateriaPrimaAction(newIngresoMateriaPrima) {
  try {
    const result = await createIngresoMateriaPrima(newIngresoMateriaPrima)
    
    if (result.status === 201) {
      revalidatePath('/produccion/ingreso-materias')
      return { success: true, ingresoMateriaPrima: result.ingresoMateriaPrima }
    }
    
    // If we get here, it's an unexpected error
    throw new Error('Unexpected response from createIngresoMateriaPrima')
  } catch (error) {
    console.error('Error in createIngresoMateriaPrimaAction:', error)
    return { success: false, message: 'Error al crear ingreso de materia prima.' }
  }
}

export async function updateIngresoMateriaPrimaAction(id, updateData) {
  try {
    const result = await updateIngresoMateriaPrima(id, updateData)
    
    if (result.status === 404) {
      return { success: false, message: result.message }
    }
    
    if (result.status === 200) {
      revalidatePath('/produccion/ingreso-materias')
      return { success: true, ingresoMateriaPrima: result.ingresoMateriaPrima }
    }
    
    // If we get here, it's an unexpected error
    throw new Error('Unexpected response from updateIngresoMateriaPrima')
  } catch (error) {
    console.error('Error in updateIngresoMateriaPrimaAction:', error)
    return { success: false, message: 'Error al actualizar ingreso de materia prima.' }
  }
}

export async function deleteIngresoMateriaPrimaAction(id) {
  try {
    const result = await deleteIngresoMateriaPrima(id)
    
    if (result.status === 404) {
      return { success: false, message: result.message }
    }
    
    if (result.status === 200) {
      revalidatePath('/produccion/ingreso-materias')
      return { success: true, message: result.message }
    }
    
    // If we get here, it's an unexpected error
    throw new Error('Unexpected response from deleteIngresoMateriaPrima')
  } catch (error) {
    console.error('Error in deleteIngresoMateriaPrimaAction:', error)
    return { success: false, message: 'Error al eliminar ingreso de materia prima.' }
  }
}

