import { useState, useEffect } from 'react'
import { getMateriaPrimasAction } from '@/app/actions/materiasPrimasActions'

function convertToPlainObject(doc) {
  return {
    _id: doc._id.toString(),
    codigo: doc.codigo,
    nombre: doc.nombre,
    sinonimos: doc.sinonimos,
    codigoInterno: doc.codigoInterno,
    organization: doc.organization.toString(), // Convert ObjectId to string
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  }
}

export function useMateriasPrimas(organizationId) {
  const [materiasPrimas, setMateriasPrimas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMateriasPrimas() {
      try {
        const result = await getMateriaPrimasAction(organizationId)
        if (result.status === 200) {
          const plainMateriasPrimas = result.materiasPrimas.map(convertToPlainObject)
          setMateriasPrimas(plainMateriasPrimas)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError('Error al cargar materias primas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMateriasPrimas()
  }, [organizationId])

  return { materiasPrimas, isLoading, error }
}

