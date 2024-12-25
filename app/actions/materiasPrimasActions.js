'use server'
import { getMateriaPrimas, getMateriaPrimasByOrganizationPagination,updateMateriaPrima,createMateriaPrima} from "@/lib/mongo/materiaPrima"
import { revalidatePath } from "next/cache"
import organization from "../organization/page"

 
export async function getMateriaPrimasAction(organizationId) {
    try {
      const materiasPrimas = await getMateriaPrimas(organizationId)
      return { 
        status: 200, 
        materiasPrimas: materiasPrimas.map(mp => ({
          ...mp.toObject(),
          _id: mp._id.toString(),
          organization: mp.organization.toString()
        }))
      }
    } catch (error) {
      console.error('Error al obtener materias primas:', error)
      return { status: 500, message: 'Error al obtener materias primas.' }
    }
  }

  export async function getMateriaPrimasByOrganizationPaginationAction(organizationId, query = '', page = 1, limit = 10) {
    const result = await getMateriaPrimasByOrganizationPagination(organizationId, query, page, limit)
    return result
  }

  export async function createMateriaPrimaAction(newMateriaPrima) {
    try {
      const result = await createMateriaPrima(newMateriaPrima)
      
      if (result.status === 201) {
        revalidatePath('/produccion/materias-primas')
        return { success: true, materiaPrima: result.materiaPrima }
      }
      
      // If we get here, it's an unexpected error
      throw new Error('Unexpected response from createMateriaPrima')
    } catch (error) {
      console.error('Error in createMateriaPrimaAction:', error)
      return { success: false, message: 'Error al crear materia prima.' }
    }
  }


  export async function updateMateriaPrimaAction(id, updateData) {
    try {
      const result = await updateMateriaPrima(id, updateData)
      
      if (result.status === 404) {
        return { success: false, message: result.message }
      }
      
      if (result.status === 200) {
        revalidatePath('/produccion/materias-primas')
        return { success: true, materiaPrima: result.materiaPrima }
      }
      
      // If we get here, it's an unexpected error
      throw new Error('Unexpected response from updateMateriaPrima')
    } catch (error) {
      console.error('Error in updateMateriaPrimaAction:', error)
      return { success: false, message: 'Error al actualizar materia prima.' }
    }
  }
  



