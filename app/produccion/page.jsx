import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ShoppingBasket, CookingPot, GanttChartIcon as ChartNoAxesGantt, LogOut, ScanEye } from 'lucide-react'

// import { getMateriaPrimas } from '@/lib/mongo/materiaPrima'
// import { getRecetas } from '@/lib/mongo/receta'
// import { getOrdenesProduccion } from '@/lib/mongo/ordenProduccion'
// import { getEgresosProductoTerminado } from '@/lib/mongo/egresoProductoTerminado'
// import { getControlesCalidad } from '@/lib/mongo/controlCalidad'

// Datos de ejemplo basados en los modelos creados
const materiasPrimas = [
  { _id: '1', codigo: 'MP001', nombre: 'Harina', sinonimos: ['Harina de trigo'], codigoInterno: 'HT001' },
  { _id: '2', codigo: 'MP002', nombre: 'Azúcar', sinonimos: ['Azúcar blanca'], codigoInterno: 'AZ001' },
  { _id: '3', codigo: 'MP003', nombre: 'Leche', sinonimos: ['Leche entera'], codigoInterno: 'LE001' },
]

const recetas = [
  { _id: '1', nombre: 'Pan Blanco', ingredientes: [{ materiaPrima: '1', cantidad: 500, unidad: 'g' }] },
  { _id: '2', nombre: 'Galletas', ingredientes: [{ materiaPrima: '1', cantidad: 300, unidad: 'g' }, { materiaPrima: '2', cantidad: 200, unidad: 'g' }] },
]

const ordenesProduccion = [
  { _id: '1', receta: '1', cantidadSolicitada: 100, estado: 'En Proceso' },
  { _id: '2', receta: '2', cantidadSolicitada: 200, estado: 'Pendiente' },
]

const egresosProducto = [
  { _id: '1', ordenProduccion: '1', cantidadEgresada: 50, lote: 'L001' },
  { _id: '2', ordenProduccion: '2', cantidadEgresada: 100, lote: 'L002' },
]

const controlesCalidad = [
  { _id: '1', ordenProduccion: '1', parametros: [{ nombre: 'Peso', valor: 500, cumple: true }], aprobado: true },
  { _id: '2', ordenProduccion: '2', parametros: [{ nombre: 'Textura', valor: 'Crujiente', cumple: true }], aprobado: true },
]

export default function ProduccionDashboard() {
  // Fetch data for previews
  // const materiasPrimas = await getMateriaPrimas()
  // const recetas = await getRecetas()
  // const ordenesProduccion = await getOrdenesProduccion()
  // const egresosProducto = await getEgresosProductoTerminado()
  // const controlesCalidad = await getControlesCalidad()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Producción</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Materias Primas"
          description={`${materiasPrimas.length} materias primas registradas`}
          icon={<ShoppingBasket className="h-6 w-6" />}
          linkHref="/produccion/materias-primas"
        />
        <DashboardCard
          title="Recetas"
          description={`${recetas.length} recetas disponibles`}
          icon={<CookingPot className="h-6 w-6" />}
          linkHref="/produccion/recetas"
        />
        <DashboardCard
          title="Órdenes de Producción"
          description={`${ordenesProduccion.length} órdenes activas`}
          icon={<ChartNoAxesGantt className="h-6 w-6" />}
          linkHref="/produccion/ordenes-produccion"
        />
        <DashboardCard
          title="Egreso de Producto"
          description={`${egresosProducto.length} egresos registrados`}
          icon={<LogOut className="h-6 w-6" />}
          linkHref="/produccion/egreso-producto"
        />
        <DashboardCard
          title="Control de Calidad"
          description={`${controlesCalidad.length} controles realizados`}
          icon={<ScanEye className="h-6 w-6" />}
          linkHref="/produccion/control-calidad"
        />
      </div>
    </div>
  )
}

function DashboardCard({ title, description, icon, linkHref }) {
  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={linkHref} passHref>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Ver más</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

